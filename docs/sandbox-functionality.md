# OSS Sandbox Functionality

This document describes the sandbox (row-level security) functionality implemented for the open-source version of Metabase.

## Overview

The sandbox functionality allows administrators to restrict data access for specific user groups by filtering rows based on field values and user group attributes.

## Architecture

### Backend Components

1. **Database Schema**: The `group_sandbox` table stores sandbox configurations
   - `id`: Primary key
   - `group_id`: References the user group
   - `table_id`: References the table to be sandboxed
   - `field_id`: The field used for filtering
   - `group_attribute`: The group attribute to compare against

2. **Model**: `metabase.sandbox.models.group-sandbox`
   - Defines `:model/GroupSandbox` using Toucan2 model conventions
   - Provides the `upsert-sandbox!` function for creating/updating sandbox policies

3. **API**: `metabase.sandbox.api`
   - REST endpoints for managing sandbox configurations
   - Routes: `/api/sandbox/group/:group-id/table/:table-id`

4. **Permissions Integration**: Updates in `metabase.permissions.models.data-permissions.graph`
   - Integrates sandbox policies into the permissions graph
   - Marks sandboxed tables with `:sandboxed` permission value

### Frontend Components

1. **API Client**: `metabase/api/sandbox.ts`
   - TypeScript API definitions and client functions

2. **Utils**: `metabase/admin/permissions/components/SandboxUtils.js`
   - Helper functions for managing sandbox configurations
   - Handles API calls and local caching

3. **UI Components**: 
   - `EditSandboxingModal`: Modal for configuring sandbox policies
   - `PermissionsSelect`: Updated to support sandbox configuration

## Usage

### Setting up a Sandbox Policy

1. Navigate to Admin > Permissions
2. Select a user group
3. Find the table you want to sandbox
4. Click on the permissions dropdown
5. Select "Sandboxed" 
6. Configure the sandbox policy:
   - Select the field to filter on
   - Choose the group attribute to compare against

### API Usage

Create a sandbox policy:
```bash
POST /api/sandbox/group/1/table/1
{
  "field_id": 10,
  "group_attribute": "id"
}
```

Get a sandbox policy:
```bash
GET /api/sandbox/group/1/table/1
```

Delete a sandbox policy:
```bash
DELETE /api/sandbox/group/1/table/1
```

## Database Migration

The sandbox table is created automatically via Liquibase migration `v55.2025-07-01T12:00:00`.

## Testing

Run the sandbox tests:
```bash
# Backend tests
clojure -X:dev:test :only metabase.sandbox.api-test
clojure -X:dev:test :only metabase.sandbox.integration-test

# Frontend tests  
yarn test SandboxUtils.unit.spec.js
```

## Security Considerations

- Sandbox policies are only configurable by superusers
- The sandbox model uses superuser read/write policies
- Field values are compared against group attributes for row filtering
- This is a basic implementation - consider additional security measures for production use

## Limitations

- This is a simplified OSS implementation
- Advanced features like dynamic filtering and complex policies require the Enterprise Edition
- Performance may be impacted with large datasets and complex sandbox policies