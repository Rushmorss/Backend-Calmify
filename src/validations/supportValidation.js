import Joi from 'joi';

const createSupportSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.empty': 'Tên không được để trống',
    'string.min': 'Tên phải có ít nhất 3 ký tự',
    'any.required': 'Vui lòng nhập tên địa điểm/hotline'
  }),
  phoneNumber: Joi.string().pattern(/^[0-9]+$/).allow('', null).messages({
    'string.pattern.base': 'Số điện thoại chỉ được chứa số'
  }),
  address: Joi.string().max(500).allow('', null),
  note: Joi.string().allow('', null),
  typeId: Joi.alternatives()
    .try(Joi.number().integer(), Joi.string().uuid(), Joi.string())
    .required()
    .messages({
      'alternatives.match': 'Loại hỗ trợ (TypeID) phải là một ID hợp lệ',
      'any.required': 'Vui lòng chọn loại hỗ trợ'
    })
});

const validateCreateSupport = (req, res, next) => {
  const { error } = createSupportSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message 
    });
  }
  next();
};

export default {
  validateCreateSupport
};