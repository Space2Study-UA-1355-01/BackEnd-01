const offerService = require('../../../services/offer')
const Offer = require('../../../models/offer')

jest.mock('../../../models/offer', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndRemove: jest.fn(),
  aggregate: jest.fn()
}))

describe('offerService', () => {
  describe('createOffer', () => {
    it('should create a new offer', async () => {
      const mockAuthor = 'user123'
      const mockRole = 'tutor'
      const mockData = {
        price: 100,
        proficiencyLevel: 'intermediate',
        title: 'Math tutoring',
        description: 'Learn algebra with fun!',
        languages: ['en'],
        subject: 'subject123',
        category: 'category123',
        status: 'active',
        FAQ: []
      }

      const expectedOffer = {
        _id: 'offer456',
        ...mockData,
        author: mockAuthor,
        authorRole: mockRole
      }

      Offer.create.mockResolvedValue(expectedOffer)

      const result = await offerService.createOffer(mockAuthor, mockRole, mockData)

      expect(Offer.create).toHaveBeenCalledWith({
        author: mockAuthor,
        authorRole: mockRole,
        ...mockData
      })

      expect(result).toEqual(expectedOffer)
    })
  })

  describe('offerService › getOffers', () => {
    it('should get all offers', async () => {
      const mockOffers = [
        { _id: 'offer1', title: 'Math tutoring' },
        { _id: 'offer2', title: 'Science tutoring' },
      ];
  
      Offer.aggregate.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockOffers]), 
      });
  
      const pipeline = []; 
      const result = await offerService.getOffers(pipeline);
  
      expect(Offer.aggregate).toHaveBeenCalledWith([]);
      expect(result).toEqual(mockOffers);
    });
  });

  describe('getOfferById', () => {
    it('should get an offer by ID', async () => {
      const mockOffer = {
        _id: 'offer1',
        title: 'Math tutoring',
        author: { firstName: 'John', lastName: 'Doe', FAQ: {} },
        subject: { name: 'Math' },
        category: { appearance: 'Tutoring' },
      };
  
      Offer.findById.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockOffer),
      });
  
      const result = await offerService.getOfferById('offer1');
  
      expect(Offer.findById).toHaveBeenCalledWith('offer1');
      expect(result).toEqual(mockOffer);
    });

    it('should throw an error when document is not found', async () => {
      Offer.findById.mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null), 
      });
    
      await expect(offerService.getOfferById('nonexistentOffer')).rejects.toThrow(TypeError);
    });
  });

  describe('deleteOffer', () => {
    it('should delete offer by ID', async () => {
      
      Offer.findByIdAndRemove.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true)
      })

      const result = await offerService.deleteOffer('offer1')
      expect(Offer.findByIdAndRemove).toHaveBeenCalledWith('offer1')
      expect(result).toBeUndefined() 
    })
  })
})
