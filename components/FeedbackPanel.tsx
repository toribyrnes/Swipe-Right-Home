import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { feedbackTags } from '@/data/mockListings';

const { height: screenHeight } = Dimensions.get('window');

interface FeedbackPanelProps {
  visible: boolean;
  action: 'liked' | 'rejected';
  onTagSelect: (tags: string[]) => void;
  onClose: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  visible,
  action,
  onTagSelect,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: visible
            ? withSpring(0, { damping: 20, stiffness: 300 })
            : withSpring(screenHeight, { damping: 20, stiffness: 300 }),
        },
      ],
    };
  });

  const handleTagPress = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 3) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    onTagSelect(selectedTags);
    setSelectedTags([]);
    onClose();
  };

  const handleSkip = () => {
    setSelectedTags([]);
    onClose();
  };

  React.useEffect(() => {
    if (!visible) {
      setSelectedTags([]);
    }
  }, [visible]);

  const relevantTags = action === 'liked' 
    ? feedbackTags.filter(tag => !['Too expensive', 'Too small', 'Needs updates', 'Not my style'].includes(tag))
    : feedbackTags.filter(tag => ['Too expensive', 'Too small', 'Needs updates', 'Not my style'].includes(tag));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BlurView intensity={80} style={styles.blurView}>
        <View style={[styles.panel, { backgroundColor: colors.background }]}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {action === 'liked' ? '❤️ Tell us what you loved!' : '💭 What wasn\'t right?'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Help us learn your preferences (select up to 3)
            </Text>
          </View>

          <View style={styles.tagsContainer}>
            {relevantTags.map((tag, index) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: isSelected 
                        ? (action === 'liked' ? '#4dd865' : '#ff4458')
                        : colors.background,
                      borderColor: isSelected 
                        ? (action === 'liked' ? '#4dd865' : '#ff4458')
                        : colors.text + '40',
                    }
                  ]}
                  onPress={() => handleTagPress(tag)}
                  disabled={!isSelected && selectedTags.length >= 3}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: isSelected ? '#fff' : colors.text,
                        opacity: (!isSelected && selectedTags.length >= 3) ? 0.5 : 1,
                      }
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={[styles.skipButtonText, { color: colors.text }]}>
                Skip
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: selectedTags.length > 0 
                    ? (action === 'liked' ? '#4dd865' : '#ff4458')
                    : colors.text + '20',
                }
              ]}
              onPress={handleSubmit}
              disabled={selectedTags.length === 0}
            >
              <Text style={styles.submitButtonText}>
                Submit ({selectedTags.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  blurView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  panel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.select({ ios: 34, android: 24 }),
    minHeight: screenHeight * 0.4,
    maxHeight: screenHeight * 0.7,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
  },
  tagText: {
    fontSize: 15,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});