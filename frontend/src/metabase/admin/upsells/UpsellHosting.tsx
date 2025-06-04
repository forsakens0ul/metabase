import { jt, t } from "ttag";

const RocketGlobeIllustrationSrc = "app/assets/img/rocket-globe.svg";
import { useSelector } from "metabase/lib/redux";
import { getIsHosted } from "metabase/setup/selectors";

import { UpsellCard } from "./components";

// the default 200px width will break the title into two lines
const UPSELL_CARD_WIDTH = 202;
const CLOUD_PAGE = "/admin/settings/cloud";

export const UpsellHosting = ({ source }: { source: string }) => {
  const isHosted = useSelector(getIsHosted);

  if (isHosted) {
    return null;
  }

  return null;
};

export const UpsellHostingUpdates = ({ source }: { source: string }) => {
  const isHosted = useSelector(getIsHosted);

  if (isHosted) {
    return null;
  }

  return null;
};
