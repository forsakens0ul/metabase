import { t } from "ttag";

import { hasAnySsoFeature } from "metabase/common/utils/plan";
import { useSelector } from "metabase/lib/redux";
import { getSetting } from "metabase/selectors/settings";
import { Box, List } from "metabase/ui";

import { UpsellCard } from "./components";
import { UPGRADE_URL } from "./constants";

export const UpsellSSO = ({ source }: { source: string }) => {
  const tokenFeatures = useSelector((state) =>
    getSetting(state, "token-features"),
  );

  const hasSso = hasAnySsoFeature(tokenFeatures);
  const hasScim = tokenFeatures["scim"];

  if (hasSso || hasScim) {
    return null;
  }

  return null;
};
