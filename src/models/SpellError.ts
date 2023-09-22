import mongoose from 'mongoose';

const SpellErrorSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  spellerrors: {
    type: Number,
    default: 0,
  },
});

const SpellError = mongoose.model('SpellError', SpellErrorSchema);

export default SpellError;
