import { t } from "ttag";

import ExternalLink from "metabase/core/components/ExternalLink";
import { useSelector } from "metabase/lib/redux";
import { getDocsUrl } from "metabase/selectors/settings";
import { Box, type BoxProps, Text } from "metabase/ui";

import { UpsellCard, type UpsellCardProps } from "./components";
import { UPGRADE_URL } from "./constants";

const usageAnalyticsIllustrationSource = "app/assets/img/usage-analytics.png";

export const UpsellUsageAnalytics = (
  props: BoxProps &
    Omit<
      UpsellCardProps,
      "children" | "title" | "buttonText" | "buttonLink" | "campaign"
    >,
) => {
  const usageAnalyticsUrl = useSelector((state) =>
    getDocsUrl(state, {
      page: "usage-and-performance-tools/usage-analytics",
    }),
  );
  return null;
};
