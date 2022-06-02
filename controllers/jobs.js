const Jobs = require('../model/Job');
const { StatusCodes } = require('http-status-codes')

const getAllJobs = async (req, res) => {
    const jobs = await Jobs.find({ createdBy: req.user.userID }).sort('-createdAt');
    res.status(StatusCodes.OK).json({jobs,count:jobs.length});
}

const getJob = async (req, res) => {
    /* const{
     user:{userID},
     params:{id:JobID}
     }=req;
     */              // This is another way to write below two lines, i.e. Line 15 and 16
    const { userID } = req.user;
    const { id: JobID } = req.params;
    const job = await Jobs.findOne({
        _id: JobID,
        createdBy: userID
    })
    if (!job)
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "No Such Job" });

    res.status(StatusCodes.OK).json({ job });
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userID;
    const job = await Jobs.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}

const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userID },
        params: { id: JobID },
    } = req;

    if (!company === '' || !position === '')
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Company or Position is Empty" });

    const job = await Jobs.findOneAndUpdate({
        _id: JobID,
        createdBy: userID
    }, req.body,
        {
            new: true,
            runValidators: true
        });
        if(!job)
        return res.status(StatusCodes.NOT_FOUND).json({msg:"No such Job found"});

    res.status(StatusCodes.OK).json({job});
}

const deleteJob = async (req, res) => {
    const {
        user:{userID},
        params:{id:JobID}
    }=req;

    const job=await Jobs.findByIdAndDelete({
        _id:JobID,
        createdBy:userID,
    });
    if(!job)
    return res.status(StatusCodes.NOT_FOUND).json({msg:"No Such Job Found"});

    res.status(200).send("Deleted Successfully");
}

module.exports = {
    getAllJobs, getJob, createJob, updateJob, deleteJob
}