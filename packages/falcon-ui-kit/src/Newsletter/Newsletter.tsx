import React from 'react';
import { T, I18n } from '@deity/falcon-i18n';
import { Box, H3, Text, Group, Input, Button, Checkbox, Label } from '@deity/falcon-ui';
import { NewsletterLayout } from './NewsletterLayout';

export const Newsletter: React.SFC = () => (
  <NewsletterLayout>
    <H3>
      <T id="newsletter.title" />
    </H3>
    <Text>
      <T id="newsletter.message" />
    </Text>
    <I18n>
      {t => (
        <Box as="form" justifySelf="stretch">
          <Group>
            <Input
              type="email"
              required
              aria-label={t('newsletter.emailPlaceholder')}
              placeholder={t('newsletter.emailPlaceholder')}
            />
            <Button as="input" type="submit" value={t('newsletter.subscribe')} flex="none" />
          </Group>
          <Label htmlFor="subscribe" my="sm" display="flex" justifyContent="center" alignItems="center">
            <Checkbox id="subscribe" required mr="xs" /> {t('newsletter.consent')}
          </Label>
        </Box>
      )}
    </I18n>
  </NewsletterLayout>
);
