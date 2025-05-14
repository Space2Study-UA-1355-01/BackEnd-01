const { Schema, model } = require('mongoose');
const { SUBJECT } = require('~/consts/models');
const { FIELD_CANNOT_BE_EMPTY, ENUM_CAN_BE_ONE_OF } = require('~/consts/errors');
const {
  enums: { SUBJECT_STATUS_ENUM }
} = require('~/consts/validation')
const { CATEGORY } = require('~/consts/models');
const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('name')],
      unique: true,
      trim: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY,
      required: [true, FIELD_CANNOT_BE_EMPTY('category')]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
      default: null
    },
    totalOffers: {
      student: {
        type: Number,
        default: 0
      },
      tutor: {
        type: Number,
        default: 0
      }
    },
    status: {
      type: String,
      enum: {
        values: SUBJECT_STATUS_ENUM,
        message: ENUM_CAN_BE_ONE_OF('subject status', SUBJECT_STATUS_ENUM)
      },
      default: SUBJECT_STATUS_ENUM[0]
    },
  },
  {
    timestamps: true, 
    versionKey: false
  }
);

module.exports = model(SUBJECT, subjectSchema);
