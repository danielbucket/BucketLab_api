const resumeData = require('./resume.stub.json');

module.exports = getResume = async (req, res) => {
  try {
    res.status(200).json(resumeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the resume data.' });
  }
};