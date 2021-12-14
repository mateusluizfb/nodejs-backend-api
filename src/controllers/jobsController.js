const FindUnpaidJobsService = require('../services/findUnpaidJobsService');
const PayJobService = require('../services/payJobService');

const JobsController = {

  // GET
  // route: /jobs/unpaid
  getUnpaid: async (req, res) => {
    const {id} = req.params

    const jobs = await FindUnpaidJobsService.call({profile_id: req.profile.id })
    res.json(jobs)
  },

  // GET
  // route: /jobs/:job_id/pay
  // params:
  // - job_id: <Number>
  pay: async (req, res) => {
    const { job_id } = req.params

    const paidJob = await PayJobService.call({ id: job_id, profile_id: req.profile.id })

    if(!paidJob) return res.status(404).end()
    res.json(paidJob)
  }
}

module.exports = JobsController
