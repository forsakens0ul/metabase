import { c, t } from "ttag";

import { getPlan } from "metabase/common/utils/plan";
import { useSelector } from "metabase/lib/redux";
import { getSetting } from "metabase/selectors/settings";

import { UpsellCard } from "./components";
import { UPGRADE_URL } from "./constants";

export const UpsellBetterSupport = ({ source }: { source: string }) => {
  const plan = useSelector((state) =>
    getPlan(getSetting(state, "token-features")),
  );

  if (plan !== "oss") {
    return null;
  }

  return null;
};
