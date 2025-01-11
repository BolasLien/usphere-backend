const topicService = require("./topicService");
const db = require("../utils/db");

jest.mock("../utils/db");

describe("Topic Service", () => {
  describe("getAllTopics", () => {
    it("should return all topics with default parameters", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
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
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
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
        eq: jest.fn().mockReturnThis(),
        contains: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ tags: "tag1" });
      expect(result).toEqual(mockData);
    });

    it("should sort topics by newest", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
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
        eq: jest.fn().mockReturnThis(),
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
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ page: 2 });
      expect(result).toEqual(mockData);
    });

    it("should throw an error if db query fails", async () => {
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest
          .fn()
          .mockReturnValue({ data: null, error: { message: "Error" } }),
      });

      await expect(topicService.getAllTopics({})).rejects.toThrow("Error");
    });

    it("should filter topics by multiple tags", async () => {
      const mockData = [
        {
          id: 1,
          title: "Test Topic with Multiple Tags",
          tags: ["tag1", "tag2"],
        },
      ];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        contains: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ tags: ["tag1", "tag2"] });
      expect(result).toEqual(mockData);
    });

    it("should handle invalid sort parameter", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
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
        eq: jest.fn().mockReturnThis(),
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
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.getAllTopics({ keyword: "" });
      expect(result).toEqual(mockData);
    });
  });

  // 刪除話題
  describe("deleteTopic", () => {
    it("should delete topic with valid id", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.deleteTopic(1);
      expect(result).toEqual(mockData);
    });

    it("should return null for non-existing id", async () => {
      db.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: [], error: null }),
      });

      const result = await topicService.deleteTopic(999);
      expect(result).toBeNull();
    });

    it("should return null for already deleted topic", async () => {
      db.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: [], error: null }),
      });

      const result = await topicService.deleteTopic(1);
      expect(result).toBeNull();
    });

    it("should throw an error if db query fails", async () => {
      db.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: null, error: { message: "Error" } }),
      });

      await expect(topicService.deleteTopic(1)).rejects.toThrow("Failed to delete topic: Error");
    });
  });

  // 恢復話題
  describe("restoreTopic", () => {
    it("should restore topic with valid id", async () => {
      const mockData = [{ id: 1, title: "Test Topic" }];
      db.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: mockData, error: null }),
      });

      const result = await topicService.restoreTopic(1);
      expect(result).toEqual(mockData);
    });

    it("should return null for non-deleted topic", async () => {
      db.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: [], error: null }),
      });

      const result = await topicService.restoreTopic(1);
      expect(result).toBeNull();
    });

    it("should return null for invalid topic id", async () => {
      db.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: [], error: null }),
      });

      const result = await topicService.restoreTopic(999);
      expect(result).toBeNull();
    });

    it("should throw an error if db query fails", async () => {
      db.from.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnValue({ data: null, error: { message: "Error" } }),
      });

      await expect(topicService.restoreTopic(1)).rejects.toThrow("Failed to restore topic: Error");
    });
  });
});
