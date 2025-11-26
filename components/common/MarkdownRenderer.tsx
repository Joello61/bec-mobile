import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  // Gestion des liens externes
  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
    return false; // Empêche le comportement par défaut
  };

  return (
    <View className={`flex-1 ${className}`}>
      <Markdown
        style={markdownStyles}
        onLinkPress={handleLinkPress}
        rules={{
          // Personnalisation supplémentaire si nécessaire
        }}
      >
        {content}
      </Markdown>
    </View>
  );
};

// Styles personnalisés pour le Markdown
const markdownStyles = StyleSheet.create({
  // Body
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151', // gray-700
  },

  // Headings
  heading1: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827', // gray-900
    marginTop: 24,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb', // blue-600
    paddingBottom: 8,
  },
  heading2: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // gray-200
    paddingBottom: 8,
  },
  heading3: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937', // gray-800
    marginTop: 20,
    marginBottom: 12,
  },
  heading4: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 10,
  },
  heading5: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  heading6: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 10,
    marginBottom: 6,
  },

  // Paragraphs
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 12,
  },

  // Links
  link: {
    color: '#2563eb', // blue-600
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  // Lists
  bullet_list: {
    marginBottom: 12,
    marginLeft: 16,
  },
  ordered_list: {
    marginBottom: 12,
    marginLeft: 16,
  },
  list_item: {
    marginBottom: 8,
    lineHeight: 24,
    color: '#374151',
  },
  bullet_list_icon: {
    color: '#374151',
    marginRight: 8,
  },
  ordered_list_icon: {
    color: '#374151',
    marginRight: 8,
  },

  // Blockquote
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
    backgroundColor: '#f9fafb', // gray-50
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

  // Code
  code_inline: {
    backgroundColor: '#f3f4f6', // gray-100
    color: '#dc2626', // red-600
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: '#111827', // gray-900
    color: '#f3f4f6', // gray-100
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  fence: {
    backgroundColor: '#111827',
    color: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },

  // Table
  table: {
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thead: {
    backgroundColor: '#f3f4f6', // gray-100
  },
  tbody: {
    backgroundColor: '#ffffff',
  },
  th: {
    padding: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // gray-200
  },
  td: {
    padding: 12,
    fontSize: 14,
    color: '#374151',
  },

  // Horizontal Rule
  hr: {
    height: 2,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },

  // Strong & Em
  strong: {
    fontWeight: '700',
    color: '#111827',
  },
  em: {
    fontStyle: 'italic',
    color: '#1f2937',
  },
});

export default MarkdownRenderer;