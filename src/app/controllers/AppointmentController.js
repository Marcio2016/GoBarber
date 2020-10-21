import Appointment from '../models/Appointments'
import User from '../models/User';
import * as YUP from 'yup';


class AppointmentController {
  async store(req,res ) {
    const schema = YUP.object().shape({
      provider_id: YUP.number().required(),
      date: YUP.date().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails'});
    }

    const {provider_id,date} = req.body;
    const isProvider = await User.findOne({
      where: {id: provider_id, provider: true}
    })

    if(!isProvider){
      return res.status(401).json({error: 'You can only create appointments with provides'})
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    })
    return res.json(appointment);
  }

}

export default new AppointmentController();