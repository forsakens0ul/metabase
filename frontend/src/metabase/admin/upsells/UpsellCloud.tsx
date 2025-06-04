import { c, t } from "ttag";

import { useHasTokenFeature } from "metabase/common/hooks";
import ExternalLink from "metabase/core/components/ExternalLink";

import { UpsellBigCard } from "./components";
import S from "./components/Upsells.module.css";

export const UpsellCloud = ({
  source,
  onOpenModal,
}: {
  source: string;
  onOpenModal: () => void;
}) => {
  const isHosted = useHasTokenFeature("hosting");

  if (isHosted) {
    return null;
  }

  return null;
};
