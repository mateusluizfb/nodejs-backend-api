const FindUnpaidJobsService = require('../services/findUnpaidJobsService');

const JobsController = {
  getUnpaid: async (req, res) => {
    const {id} = req.params

    const jobs = await FindUnpaidJobsService.call({profile_id: req.profile.id })

    if(!jobs) return res.status(404).end()
    res.json(jobs)
  },

  pay: async (req, res) => {
    // const {id} = req.params
    //
    // const jobs = await FindUnpaidJobsService.call({profile_id: req.profile.id })
    //
    // if(!jobs) return res.status(404).end()
    // res.json(jobs)
  }
}

module.exports = JobsController
