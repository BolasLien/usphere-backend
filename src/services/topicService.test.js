const topicService = require("./topicService");
const db = require("../utils/db");

jest.mock("../utils/db");

describe("Topic Service", () => {
  describe("getAllTopics", () => {
    it("should return all topics with default parameters", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({});
      expect(result).toEqual(mockData);
    });

    it("should filter topics by keyword", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        ilike: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ keyword: "Test" });
      expect(result).toEqual(mockData);
    });

    it("should filter topics by tag", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        contains: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ tag: "tag1" });
      expect(result).toEqual(mockData);
    });

    it("should sort topics by newest", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ sort: "newest" });
      expect(result).toEqual(mockData);
    });

    it("should sort topics by oldest", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ sort: "oldest" });
      expect(result).toEqual(mockData);
    });

    it("should handle pagination", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ page: 2 });
      expect(result).toEqual(mockData);
    });

    it("should throw an error if db query fails", async () => {
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: null, error: { message: "Error" } }),
      });

      await expect(topicService.getAllTopics({})).rejects.toThrow("Error");
    });

    it("should filter topics by multiple tags", async () => {
      const mockData = [{ id: 1, title: "Test Topic with Multiple Tags", tags: ["tag1", "tag2"] }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        contains: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ tag: ["tag1", "tag2"] });
      expect(result).toEqual(mockData);
    });

    it("should handle invalid sort parameter", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ sort: "invalid" });
      expect(result).toEqual(mockData);
    });

    it("should handle invalid page parameter", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ page: -1 });
      expect(result).toEqual(mockData);
    });

    it("should handle invalid keyword parameter", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        ilike: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ keyword: "" });
      expect(result).toEqual(mockData);
    });
  });
});
