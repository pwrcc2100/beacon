/**
 * Re-exports client config from lib/config.
 * Prefer importing from @/lib/config/getClientConfig and @/lib/config/defaultThresholds.
 */

export { getClientConfig } from './config/getClientConfig';
export {
  defaultThresholds,
  type RiskThresholds,
} from './config/defaultThresholds';
