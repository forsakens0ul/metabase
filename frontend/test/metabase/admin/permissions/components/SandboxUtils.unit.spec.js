import {
  setSandboxConfig,
  getSandboxConfig,
  hasSandboxConfig,
  deleteSandboxConfig
} from "metabase/admin/permissions/components/SandboxUtils";

// Mock the API module
jest.mock("metabase/api", () => ({
  SandboxApi_Legacy: {
    get: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

import { SandboxApi_Legacy as SandboxApi } from "metabase/api";

describe("SandboxUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setSandboxConfig", () => {
    it("should call the API to create sandbox config", async () => {
      const mockResponse = { id: 1, group_id: 1, table_id: 1 };
      SandboxApi.create.mockResolvedValue(mockResponse);

      const config = {
        fieldId: 1,
        groupAttribute: "id"
      };

      const result = await setSandboxConfig(1, 1, config);

      expect(SandboxApi.create).toHaveBeenCalledWith({
        groupId: 1,
        tableId: 1,
        fieldId: 1,
        groupAttribute: "id"
      });
      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      const error = new Error("API Error");
      SandboxApi.create.mockRejectedValue(error);

      const config = { fieldId: 1, groupAttribute: "id" };

      await expect(setSandboxConfig(1, 1, config)).rejects.toThrow("API Error");
    });
  });

  describe("getSandboxConfig", () => {
    it("should return null when API returns 404", async () => {
      const error = new Error("Not found");
      error.status = 404;
      SandboxApi.get.mockRejectedValue(error);

      const result = await getSandboxConfig(1, 1);
      expect(result).toBeNull();
    });

    it("should transform API response to frontend format", async () => {
      const apiResponse = {
        field_id: 1,
        group_attribute: "id"
      };
      SandboxApi.get.mockResolvedValue(apiResponse);

      const result = await getSandboxConfig(1, 1);

      expect(result).toEqual({
        fieldId: 1,
        fieldName: "",
        groupAttribute: "id"
      });
    });
  });

  describe("hasSandboxConfig", () => {
    it("should return true when config exists", async () => {
      const apiResponse = { field_id: 1, group_attribute: "id" };
      SandboxApi.get.mockResolvedValue(apiResponse);

      const result = await hasSandboxConfig(1, 1);
      expect(result).toBe(true);
    });

    it("should return false when config does not exist", async () => {
      const error = new Error("Not found");
      error.status = 404;
      SandboxApi.get.mockRejectedValue(error);

      const result = await hasSandboxConfig(1, 1);
      expect(result).toBe(false);
    });
  });

  describe("deleteSandboxConfig", () => {
    it("should call the API to delete sandbox config", async () => {
      SandboxApi.delete.mockResolvedValue();

      const result = await deleteSandboxConfig(1, 1);

      expect(SandboxApi.delete).toHaveBeenCalledWith({
        groupId: 1,
        tableId: 1
      });
      expect(result).toBe(true);
    });
  });
});