import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform, Alert } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      accessibilityLabel={`Opens external link: ${href}`}
      accessibilityRole="link"
      accessibilityHint="Opens in external browser"
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          try {
            // Open the link in an in-app browser.
            await openBrowserAsync(href);
          } catch (error) {
            // Handle errors gracefully
            console.error('Failed to open external link:', error);
            Alert.alert(
              'Unable to Open Link',
              'Sorry, we could not open this link. Please try again later.',
              [{ text: 'OK' }]
            );
          }
        }
      }}
    />
  );
}
