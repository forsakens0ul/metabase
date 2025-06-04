import { t } from "ttag";

import { useHasTokenFeature } from "metabase/common/hooks";

import { UpsellBanner } from "./components";
import { UPGRADE_URL } from "./constants";

export const UpsellPermissions = ({ source }: { source: string }) => {
  const hasAdvancedPermissions = useHasTokenFeature("advanced_permissions");

  if (hasAdvancedPermissions) {
    return null;
  }

  return null;
};
