import PropTypes from "prop-types";

import { UpsellPermissions } from "metabase/admin/upsells";
import { LoadingAndErrorWrapper } from "metabase/components/LoadingAndErrorWrapper";
import { Box } from "metabase/ui";

import { PermissionsEditorRoot } from "./PermissionsEditor.styled";
import {
  PermissionsEditorContent,
  permissionEditorContentPropTypes,
} from "./PermissionsEditorContent";

export const permissionEditorPropTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  groupId: PropTypes.number,
  ...permissionEditorContentPropTypes,
};

export const PermissionsEditor = ({ isLoading, error, groupId, ...contentProps }) => {
  return (
    <PermissionsEditorRoot>
      <LoadingAndErrorWrapper loading={isLoading} error={error} noWrapper>
        <>
          <Box mx="xl" mb="md">
            <UpsellPermissions source="settings-permissions" />
          </Box>
          <PermissionsEditorContent groupId={groupId} {...contentProps} />
        </>
      </LoadingAndErrorWrapper>
    </PermissionsEditorRoot>
  );
};

PermissionsEditor.propTypes = permissionEditorPropTypes;
