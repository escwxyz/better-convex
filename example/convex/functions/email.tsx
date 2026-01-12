'use node';

import { Resend } from '@convex-dev/resend';
import { render } from '@react-email/render';
import z from 'zod';
import { privateAction } from '../lib/crpc';
import OrganizationInviteEmail from '../lib/emails/organization-invite';
import { components } from './_generated/api';

// Initialize Resend component
const resend: Resend = new Resend(components.resend, {
  testMode: process.env.NODE_ENV !== 'production',
});

// Send organization invitation email action
export const sendOrganizationInviteEmail = privateAction
  .input(
    z.object({
      acceptUrl: z.string(),
      invitationId: z.string(),
      inviterEmail: z.string(),
      inviterName: z.string(),
      organizationName: z.string(),
      role: z.string(),
      to: z.string(),
    })
  )
  .output(z.string())
  .action(async ({ ctx, input: args }) => {
    const html = await render(
      <OrganizationInviteEmail
        acceptUrl={args.acceptUrl}
        invitationId={args.invitationId}
        inviterEmail={args.inviterEmail}
        inviterName={args.inviterName}
        organizationName={args.organizationName}
        role={args.role}
        to={args.to}
      />
    );

    const emailId = await resend.sendEmail(ctx, {
      from: 'Convex Example <invites@example.com>',
      html,
      subject: `${args.inviterName} invited you to join ${args.organizationName} workspace on Convex Example`,
      to: args.to,
    });

    return emailId as string; // Return the email ID for tracking
  });
