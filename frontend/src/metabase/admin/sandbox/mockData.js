// 模拟沙盒策略数据
export const mockPolicies = [
  {
    id: 1,
    group_id: 1,
    group_name: "销售组",
    table_id: 1,
    table_name: "订单表",
    filter_condition: "user_id = {{user_id}}",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    group_id: 2,
    group_name: "市场组",
    table_id: 2,
    table_name: "客户表",
    filter_condition: "region = '华东'",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z"
  }
];

// 模拟用户组数据
export const mockGroups = [
  {
    id: 1,
    name: "销售组",
    member_count: 10
  },
  {
    id: 2,
    name: "市场组",
    member_count: 5
  },
  {
    id: 3,
    name: "技术组",
    member_count: 8
  }
];

// 模拟数据表数据
export const mockTables = [
  {
    id: 1,
    name: "订单表",
    schema: "public",
    database: "示例数据库"
  },
  {
    id: 2,
    name: "客户表",
    schema: "public",
    database: "示例数据库"
  },
  {
    id: 3,
    name: "产品表",
    schema: "public",
    database: "示例数据库"
  }
]; 