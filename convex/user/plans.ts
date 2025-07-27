import { SubscriptionPlan } from './isUserSubscribed';

export type PlanDetails = {
  key: SubscriptionPlan;
  credits: number;
  // pricing
  desc: string;
  earlyAccess: boolean;
  features: string[];
  fullFeatures: string[];
  name: string;
  price: {
    month: number;
    year: number;
  };
  privacy: boolean;
  popular?: boolean;
};

export const plansByKey = {
  [SubscriptionPlan.Free]: {
    key: SubscriptionPlan.Free,
    credits: 0,
    desc: 'For exploring publicly',
    earlyAccess: false,
    features: [
      'Limited AI Usage',
      'Create Public Character',
      'Share Chats and Characters',
      'Up to 1 Character',
    ],
    fullFeatures: [
      'Limited AI Usage',
      'Create Public Character',
      'Share Chats and Characters',
      'Up to 1 Character',
    ],
    name: 'Free',
    price: { month: 0, year: 0 },
    privacy: false,
  } as PlanDetails,
  [SubscriptionPlan.Premium]: {
    key: SubscriptionPlan.Premium,
    credits: 1000,
    desc: 'Everything in Free, plus:',
    earlyAccess: true,
    features: [
      'Standard AI Usage',
      'Create Private Characters',
      // '1000 Credits/Month',
      // 'Optional Credits Purchase',
      // 'Higher AI Usage Limits',
      'Early Access Features',
      'Up to 5 Characters',
    ],
    fullFeatures: [
      'Standard AI Usage',
      'Create Private Characters',
      // '1000 Credits/Month',
      // 'Optional Credits Purchase',
      // 'Higher AI Usage Limits',
      'Share Chats and Characters',
      'Early Access Features',
      'Up to 5 Characters',
    ],
    name: 'Premium',
    popular: true,
    price: { month: 10, year: 100 },
    privacy: false,
  } as PlanDetails,
  [SubscriptionPlan.PremiumPlus]: {
    key: SubscriptionPlan.PremiumPlus,
    credits: 2500,
    desc: 'Everything in Premium, plus:',
    earlyAccess: true,
    features: [
      // '2500 Credits/Month',
      // 'Optional Credits Purchase',
      'Advanced AI Usage',
      // 'Highest AI Usage Limits',
      'Share Chats and Characters with your Team',
      'Unlimited Characters',
    ],
    fullFeatures: [
      // 'Advanced AI Usage',
      'Highest AI Usage Limits',
      'Create Private Characters',
      // '2500 Credits/Month',
      // 'Optional Credits Purchase',
      'Share Chats and Characters with your Team',
      'Early Access Features',
      'Unlimited Characters',
    ],
    name: 'Team',
    price: { month: 20, year: 200 },
    privacy: true,
  } as PlanDetails,
};

export const paidPlans = [
  plansByKey[SubscriptionPlan.Premium],
  plansByKey[SubscriptionPlan.PremiumPlus],
];

export const plans = [
  plansByKey[SubscriptionPlan.Free],
  plansByKey[SubscriptionPlan.Premium],
  plansByKey[SubscriptionPlan.PremiumPlus],
];
