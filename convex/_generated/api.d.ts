/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth_connectSocial from "../auth/connectSocial.js";
import type * as content_drafts from "../content/drafts.js";
import type * as lib_auth from "../lib/auth.js";
import type * as scheduler_deliveryAttempts from "../scheduler/deliveryAttempts.js";
import type * as scheduler_repostRules from "../scheduler/repostRules.js";
import type * as scheduler_scheduledPosts from "../scheduler/scheduledPosts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "auth/connectSocial": typeof auth_connectSocial;
  "content/drafts": typeof content_drafts;
  "lib/auth": typeof lib_auth;
  "scheduler/deliveryAttempts": typeof scheduler_deliveryAttempts;
  "scheduler/repostRules": typeof scheduler_repostRules;
  "scheduler/scheduledPosts": typeof scheduler_scheduledPosts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
