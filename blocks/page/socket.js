window.sharejs.Doc.prototype._onMessage = function (msg) {
  if (!(msg.c === this.collection && msg.d === this.name)) {
    throw new Error("Got message for wrong document.");
  }

  // msg.a = the action.
  switch (msg.a) {
    case 'fetch':
      if (msg.data) this.ingestData(msg.data);
      this._finishSub('fetch', msg.error);
      if (this.wantSubscribe === 'fetch') this.wantSubscribe = false;
      this._clearAction('fetch');
      break;

    case 'sub':
      this._handleSubscribe(msg.error, msg.data);
      break;

    case 'unsub':
      this.subscribed = false;
      this.emit('unsubscribe');

      this._finishSub(false, msg.error);
      this._clearAction('unsubscribe');
      break;

    case 'ack':
      if (msg.error && msg.error !== 'Op already submitted') {
        if (this.inflightData) {
          console.warn('Operation was rejected (' + msg.error + '). Trying to rollback change locally.');
          this._tryRollback(this.inflightData);
          this._clearInflightOp(msg.error);
        } else {
          if (console) console.warn('Second acknowledgement message (error) received', msg, this);
        }
      }
      break;

    case 'op':
      if (this.inflightData &&
        msg.src === this.inflightData.src &&
        msg.seq === this.inflightData.seq) {
        this._opAcknowledged(msg);
        break;
      }

      if (msg.v < this.version) {
        break;
      }

      if (msg.v > this.version) {
        console.warn("Client got future operation from the server",
          this.collection, this.name, msg);
        break;
      }

      if (this.inflightData) xf(this.inflightData, msg);

      for (var i = 0; i < this.pendingData.length; i++) {
        xf(this.pendingData[i], msg);
      }

      this.version++;
      this._otApply(msg, false);
      break;

    case 'meta':
      if (console) console.warn('Unhandled meta op:', msg);
      break;

    case 'open':
      this.onOpenMessageFn(msg);
      break;

    default:
      if (console) console.warn('Unhandled document message:', msg);
      break;
  }
};

window.sharejs.Doc.prototype.setOnOpenMessageFn = function (fn) {
  window.sharejs.Doc.prototype.onOpenMessageFn = fn;
};
