import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  headcount: Number,
  hiringCriteria: {
    baseSalary: Number,
    skills: [String],
  },
  benefits: [String],
  interviewRounds: [
    {
      round: Number,
      type: String,
    },
  ],
});

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);