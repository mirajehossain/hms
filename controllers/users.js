const bcrypt = require('bcryptjs');

const { ObjectId } = require('mongoose').Types;
const { UserModel } = require('../models/users');
const { HistoryModel } = require('../models/history');
const { userType } = require('../config/constants');
const response = require('../helpers/response');

module.exports = {


  async createDoctor(req, res) {
    try {
      const payload = req.body;
      const user = await UserModel.findOne({ email: payload.email }).lean();
      payload.userType = userType.doctor;
      payload.password = bcrypt.hashSync(payload.password, Number(process.env.SALT_ROUND));

      if (user) {
        return res.status(200).send(response.success('Doctor already create with this email', {}, false));
      }

      const doctor = await UserModel.create(payload);
      return res.status(200).send(response.success('New doctor created', doctor));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async updateDoctor(req, res) {
    try {
      const payload = req.body;
      const { doctorId } = req.params;
      const user = await UserModel
        .findOneAndUpdate({ _id: doctorId }, payload, { new: true }).lean();
      return res.status(200).send(response.success('doctor profile updated', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getDoctors(req, res) {
    try {
      const user = await UserModel.find({ userType: userType.doctor }, { password: 0 });
      return res.status(200).send(response.success('doctor lists', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getDoctor(req, res) {
    try {
      const { doctorId } = req.params;
      const user = await UserModel
        .findOne({ _id: doctorId, userType: userType.doctor }, { password: 0 }).lean();
      return res.status(200).send(response.success('doctor profile', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async createPatient(req, res) {
    try {
      const payload = req.body;
      const user = await UserModel.findOne({ email: payload.email }).lean();
      payload.userType = userType.patient;
      payload.password = bcrypt.hashSync(payload.password, Number(process.env.SALT_ROUND));

      if (user) {
        return res.status(200).send(response.success('Patient already create with this email', {}, false));
      }

      const patient = await UserModel.create(payload);
      return res.status(200).send(response.success('New patient created', patient, true));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async updatePatient(req, res) {
    try {
      const payload = req.body;
      const { patientId } = req.params;
      const user = await UserModel
        .findOneAndUpdate({ _id: patientId }, payload, { new: true }).lean();
      return res.status(200).send(response.success('patient profile updated', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getPatients(req, res) {
    try {
      const user = await UserModel.find({ userType: userType.patient }, { password: 0 });
      return res.status(200).send(response.success('Patient lists', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getPatient(req, res) {
    try {
      const { patientId } = req.params;
      const user = await UserModel
        .findOne({ _id: patientId, userType: userType.patient }, { password: 0 }).lean();
      return res.status(200).send(response.success('patient profile', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getPrescription(req, res) {
    try {
      const { patientId } = req.params;
      const user = await HistoryModel
        .find({ patientId }).lean();
      return res.status(200).send(response.success('patient prescription', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getPatientReportByDoctor(req, res) {
    try {
      const { doctorId, patientId } = req.params;
      const user = await HistoryModel.find({ doctorId, patientId }).lean().exec();
      return res.status(200).send(response.success('doctor consultations history', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getDoctorReport(req, res) {
    try {
      const { doctorId } = req.params;
      const totalConsult = await HistoryModel.find({ doctorId }).countDocuments();
      const totalConsultPatient = await HistoryModel.aggregate([
        { $match: { doctorId: ObjectId(doctorId) } },
        { $group: { _id: '$patientId', count: { $sum: 1 } } },
      ]);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 5);
      const recentConsult = await HistoryModel.aggregate([
        { $match: { doctorId: ObjectId(doctorId), date: { $gte: startDate, $lte: endDate } } },
        {
          $lookup: {
            from: 'users',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient',
          },
        },
        { $unwind: '$patient' },
        {
          $project: {
            'patient.password': 0, 'patient.createdAt': 0, 'patient.updatedAt': 0, createdAt: 0,
          },
        },
      ]).sort({ date: -1 });

      return res.status(200).send(response.success('doctor consultations history', {
        totalConsult,
        totalConsultPatient: totalConsultPatient.length,
        recentConsult,
      }));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getDoctorWisePatients(req, res) {
    try {
      const { doctorId } = req.params;
      const user = await HistoryModel
        .aggregate([
          { $match: { doctorId: ObjectId(doctorId) } },
          {
            $group: {
              _id: '$patientId',
              doctorId: { $last: '$doctorId' },
              patientId: { $last: '$patientId' },
            },
          },

          {
            $lookup: {
              from: 'users',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient',
            },
          },
          { $unwind: '$patient' },
          {
            $project: {
              _id: '$patient._id',
              name: '$patient.name',
              email: '$patient.email',
              mobile: '$patient.mobile',
              image: '$patient.image',
              address: '$patient.address',
              bloodGroup: '$patient.bloodGroup',
            },
          },
        ]);
      return res.status(200).send(response.success('doctor consultations history', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getConsultationHistory(req, res) {
    try {
      const { doctorId } = req.params;
      const user = await HistoryModel
        .aggregate([
          { $match: { doctorId: ObjectId(doctorId) } },
          {
            $lookup: {
              from: 'users',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient',
            },
          },
          { $unwind: '$patient' },
          {
            $project: {
              'patient.password': 0, 'patient.createdAt': 0, 'patient.updatedAt': 0, createdAt: 0,
            },
          },
        ]);
      return res.status(200).send(response.success('doctor consultations history', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async consultPatient(req, res) {
    try {
      const { body } = req;
      const consult = await HistoryModel.create(body);

      return res.status(200).send(response.success('doctor consultations history added', consult));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async updateConsultation(req, res) {
    try {
      const { consultId } = req.params;
      const { body } = req;
      const consult = await HistoryModel.findOneAndUpdate({ _id: consultId }, body, { new: true });

      return res.status(200).send(response.success('consultation updated successfully', consult));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },
};
