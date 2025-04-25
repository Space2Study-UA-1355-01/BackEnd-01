const categoryService = require('~/services/category')
const Category = require('~/models/category')

jest.mock('~/models/category', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  findByIdAndRemove: jest.fn(),
}))

describe('categoryService', () => {
  describe('getCategories', () => {
    it('should return all categories without pagination and search', async () => {
      const mockCategories = [
        { _id: '1', name: 'Math', appearance: { icon: 'icon1', color: '#FF0000' } },
        { _id: '2', name: 'Science', appearance: { icon: 'icon2', color: '#00FF00' } },
        { _id: '3', name: 'Math1', appearance: { icon: 'icon1', color: '#FF0000' } },
        { _id: '4', name: 'Science1', appearance: { icon: 'icon2', color: '#00FF00' } },
      ]
      const mockTotal = 4

      Category.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),  
        lean: jest.fn().mockReturnThis(),  
        exec: jest.fn().mockResolvedValue(mockCategories),  
      })

      Category.countDocuments.mockResolvedValue(mockTotal)

      const result = await categoryService.getCategories({
        search: '',  
        page: 1,  
        limit: 10,
      })

      console.log(result)

      expect(Category.find).toHaveBeenCalledWith({})
      expect(result).toEqual({
        data: mockCategories,
        total: mockTotal,
        page: 1,
        limit: 10,
        totalPages: 1,
      })
    })
  })
})
