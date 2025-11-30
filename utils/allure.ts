import * as allure from "allure-js-commons";
import { Severity } from "allure-js-commons";

export function setMeta({
  name,
  owner,
  severity,
  tags,
}: {
  name?: string;
  owner?: string;
  severity?: Severity;
  tags?: string[];
}) {
  if (name) allure.displayName(name);
  if (owner) allure.owner(owner);
  if (severity) allure.severity(severity);
  if (tags) allure.tags(...tags);
}
