const mongoose = require('mongoose');
const Subject = require('~/models/subject');
const Category = require('~/models/category');
const Offer = require('~/models/offer');
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors');

const allowedOfferFieldsForUpdate = {
  price: true,
  proficiencyLevel: true,
  title: true,
  description: true,
  languages: true,
  subject: true,
  category: true,
  status: true,
  FAQ: true
}

const validateOfferOnCreate = async (data) => {
  const { subject, category } = data;

  if (!subject) {
    const err = new Error(FIELD_CANNOT_BE_EMPTY('subject'));
    err.status = 400;
    throw err;
  }

  if (!category) {
    const err = new Error(FIELD_CANNOT_BE_EMPTY('category'));
    err.status = 400;
    throw err;
  }

  if (!mongoose.Types.ObjectId.isValid(subject)) {
    const err = new Error('Invalid subject ID format');
    err.status = 400;
    throw err;
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    const err = new Error('Invalid category ID format');
    err.status = 400;
    throw err;
  }

  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    const err = new Error('Category not found');
    err.status = 404;
    throw err;
  }

  const existingSubject = await Subject.findById(subject);
  if (!existingSubject) {
    const err = new Error('Subject not found');
    err.status = 404;
    throw err;
  }

  if (existingSubject.status !== 'active') {
    const err = new Error('Subject must be active');
    err.status = 400;
    throw err;
  }

  if (existingSubject.category.toString() !== category.toString()) {
    const err = new Error('Category does not match the subject\'s category');
    err.status = 400;
    throw err;
  }

  return data;
};

const validateOfferOnUpdate = async (data, offerId) => {
  const { subject, category } = data;

  if (subject) {
    if (!mongoose.Types.ObjectId.isValid(subject)) {
      const err = new Error('Invalid subject ID format');
      err.status = 400;
      throw err;
    }

    const existingSubject = await Subject.findById(subject);
    if (!existingSubject) {
      const err = new Error('Subject not found');
      err.status = 404;
      throw err;
    }

    if (existingSubject.status !== 'active') {
      const err = new Error('Subject must be active');
      err.status = 400;
      throw err;
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        const err = new Error('Invalid category ID format');
        err.status = 400;
        throw err;
      }

      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        const err = new Error('Category not found');
        err.status = 404;
        throw err;
      }

      if (existingSubject.category.toString() !== category.toString()) {
        const err = new Error('Category does not match subject\'s category');
        err.status = 400;
        throw err;
      }
    } else {
      data.category = existingSubject.category;
    }
  } else if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      const err = new Error('Invalid category ID format');
      err.status = 400;
      throw err;
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      const err = new Error('Category not found');
      err.status = 404;
      throw err;
    }

    const currentOffer = await Offer.findById(offerId);
    const currentSubject = await Subject.findById(currentOffer.subject);
    if (!currentSubject) {
      const err = new Error('Current subject not found');
      err.status = 404;
      throw err;
    }

    if (currentSubject.category.toString() !== category.toString()) {
      const err = new Error('Category does not match current subject\'s category');
      err.status = 400;
      throw err;
    }
  }

  return data;
};

module.exports = {
  allowedOfferFieldsForUpdate,
  validateOfferOnCreate,
  validateOfferOnUpdate
}
