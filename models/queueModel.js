const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
  {
    priorityOfQueue: {
      type: String,
      enum : ["High Priority Queue", "Medium Priority Queue", "Low Priority Queue"],
      required: true,
      unique : true,
    },
    queueOfTickets: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ticket",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

queueSchema.methods = {
  addTicket: function (ticketId) {
    this.queueOfTickets.push(ticketId);
    return this.save();
  },

  popTicket: function () {
    const poppedTicket = this.queueOfTickets.shift();
    return this.save().then(() => poppedTicket);
  },

  getSize: function () {
    return this.queueOfTickets.length;
  },

  getTopTicket: function () {
    if (this.queueOfTickets.length === 0) {
      return undefined; // or any other appropriate value to indicate an empty queue
    }
    return this.queueOfTickets[0];
  },
};

module.exports = mongoose.model("Queue", queueSchema);
