import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { useNutritionStore } from '../../stores/nutritionStore';
import { useHealthStore } from '../../stores';
import { useCycleStore } from '../../stores/cycleStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface ActionItem {
  id: number;
  text: string;
  done: boolean;
}

interface InsightCard {
  icon: string;
  title: string;
  body: string;
  color: string;
}

const DEFAULT_QUICK_PROMPTS = [
  'How am I doing?',
  'Should I work out?',
  'Meal suggestions',
  'Analyze my sleep',
  'Goal check-in',
];

const DEFAULT_ACTION_ITEMS: ActionItem[] = [
  { id: 1, text: 'Morning run 5.2km ✅', done: true },
  { id: 2, text: 'Drink 2.5L water (6/8 glasses)', done: false },
  { id: 3, text: 'Log breakfast ✅', done: true },
  { id: 4, text: 'Evening walk 2,000 steps', done: false },
  { id: 5, text: 'Wind down by 10PM', done: false },
];

const DEFAULT_INSIGHTS: InsightCard[] = [
  { icon: '💪', title: 'Strength Trend', body: 'Squat plateaued 3 weeks. Try Bulgarian split squats to break through!', color: COLORS.calories },
  { icon: '🏃', title: 'Cardio Progress', body: '5K improved 1:23 this month. Sub-25min in ~6 weeks with intervals.', color: COLORS.primary },
  { icon: '🔋', title: 'Recovery Status', body: '7-day training load: high (187). Consider a deload week soon.', color: COLORS.warning },
  { icon: '🥗', title: 'Nutrition Timing', body: '68% of calories after 6PM. Distribute more evenly for better results.', color: COLORS.sleep },
];

export const CoachScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hey there! 👋 Great progress today! Your health score is looking good at 78/100. What would you like to work on?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionItems, setActionItems] = useState<ActionItem[]>(DEFAULT_ACTION_ITEMS);
  const flatListRef = useRef<FlatList>(null);

  const { getTotalNutrition, goal: nutritionGoal } = useNutritionStore();
  const { healthData } = useHealthStore();
  const { settings, getPredictions, getCurrentPhase } = useCycleStore();

  const totals = getTotalNutrition();
  const cyclePredictions = getPredictions();
  const currentCyclePhase = getCurrentPhase();

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('how am i') || lowerQuery.includes('doing')) {
      return `📊 Your week in review:

• Steps: avg 8,420/day (84% of goal)
• Workouts: 3/4 planned ✅
• Nutrition: ${Math.round((totals.calories / nutritionGoal.calories) * 100)}% calorie adherence
• Sleep: 7.2h avg (below ideal 7.5h+)
• Resting HR: 64 bpm (excellent!)

Overall score: 78/100. Focus on hitting your sleep goal this week!`;
    }

    if (lowerQuery.includes('work out')) {
      return `💪 Based on your data:

• Last workout: 1 day ago
• Sleep last night: 7.2h ✅
• Recovery score: 78/100
• HRV: 52ms (normal)

Recommendation: YES — moderate intensity. Upper body or 30-min cardio would be ideal. Avoid max effort today.`;
    }

    if (lowerQuery.includes('meal')) {
      return `🥗 Based on your ${totals.calories} kcal today:

• Protein: ${totals.protein}g (${Math.round((totals.protein / nutritionGoal.protein) * 100)}% of goal)
• Remaining: ${nutritionGoal.calories - totals.calories} kcal

Suggested dinner: Salmon (200g) + Quinoa (185g) + Broccoli (150g) = ~520 kcal, 45g protein. That would nail your protein goal! 🎯`;
    }

    if (lowerQuery.includes('sleep')) {
      return `😴 Sleep analysis:

• Last 7-day avg: 7.2h
• Optimal target: 7.5–8.5h
• Best nights: after workout days (+47 min)

Tip: Schedule workouts before 7PM and add a 10-min wind-down routine. Avoiding screens 1hr before bed could add 20–30 min of deep sleep!`;
    }

    if (lowerQuery.includes('goal')) {
      return `🎯 Goal Update:

1. Lose 5kg — On track (77.2kg → 72kg)
2. Run 5K <25min — Improving! (27.5 → 25min in ~6 weeks)
3. 10k Steps — Behind (8,420 avg). Add a lunch walk!

You're making solid progress. Small consistent actions compound into big results! 🚀`;
    }

    // Cycle tracker responses
    if (lowerQuery.includes('cycle') || lowerQuery.includes('period') || lowerQuery.includes('menstrual') || lowerQuery.includes('fertile') || lowerQuery.includes('ovulation')) {
      if (!settings.isEnabled) {
        return `🌸 Cycle Tracker:

⚙️ Status: Not Configured (Gender: Male)

The cycle tracking feature is currently disabled. To enable it:
1. Go to your Profile tab
2. Find "Cycle Tracker" 
3. Set your cycle length and period length

This feature is designed for female users to track their menstrual cycle, predict periods, and identify fertile windows. It helps with:
• Period prediction
• Fertile window estimation  
• Cycle regularity tracking
• Symptom logging

Would you like me to help you set it up?`;
      }

      const phaseEmojis: Record<string, string> = {
        menstruation: '🩸',
        fertile: '🌸',
        ovulation: '🥚',
        luteal: '🌙',
        not_configured: '⚙️',
      };

      const phaseNames: Record<string, string> = {
        menstruation: 'Menstruation',
        fertile: 'Fertile Window',
        ovulation: 'Ovulation',
        luteal: 'Luteal Phase',
        not_configured: 'Not Configured',
      };

      const currentPhase = currentCyclePhase || 'not_configured';
      const emoji = phaseEmojis[currentPhase] || '📊';
      const phaseName = phaseNames[currentPhase] || 'Unknown';

      let response = `🌸 Cycle Insights:

📍 Current Phase: ${emoji} ${phaseName}
📅 Cycle Length: ${settings.cycleLength} days
🩸 Period Length: ${settings.periodLength} days`;

      if (cyclePredictions) {
        response += `

📆 Predictions:
• Next Period: ${new Date(cyclePredictions.nextPeriod).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
• Ovulation: ${new Date(cyclePredictions.ovulationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
• Fertile Window: ${new Date(cyclePredictions.nextFertileWindow.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(cyclePredictions.nextFertileWindow.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }

      if (currentPhase === 'menstruation') {
        response += `

💡 Tips: Rest and stay hydrated. Light exercise like walking or yoga is recommended.`;
      } else if (currentPhase === 'fertile' || currentPhase === 'ovulation') {
        response += `

💡 Tips: High energy levels! Great time for intense workouts.`;
      } else if (currentPhase === 'luteal') {
        response += `

💡 Tips: Energy may vary. Listen to your body. Moderate intensity is ideal.`;
      }

      return response;
    }

    if (lowerQuery.includes('enable cycle') || lowerQuery.includes('setup cycle') || lowerQuery.includes('configure cycle')) {
      return `🌸 To enable cycle tracking:

1. Go to the Profile tab
2. Find the "Cycle Tracker" section
3. Tap the ⚙️ settings icon
4. Enter your cycle length (typically 21-35 days, avg 28)
5. Enter your period length (typically 3-7 days, avg 5)
6. Tap "Save Settings"

Once configured, you can:
• Log daily symptoms
• Track flow intensity
• Get period predictions
• Identify fertile windows

Would you like more help setting this up?`;
    }

    return `🤖 Great question! Based on your current data (Health Score: 78/100, ${healthData?.steps || 8420} steps today), you're making solid progress. What specific area would you like to explore? Try asking about workouts, nutrition, sleep, or your goals.`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
      setIsLoading(false);
    }, 800 + Math.random() * 600);
  };

  const toggleActionItem = (id: number) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.coachCard}>
          <Text style={styles.coachEmoji}>🤖</Text>
          <View style={styles.coachInfo}>
            <Text style={styles.coachName}>Coach Alex</Text>
            <Text style={styles.coachSubtitle}>AI Fitness Coach</Text>
          </View>
          <View style={styles.healthScoreContainer}>
            <Text style={styles.healthScoreValue}>78</Text>
            <Text style={styles.healthScoreLabel}>SCORE</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Action Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Today's Actions</Text>
          <View style={styles.actionItemsCard}>
            {actionItems.map((item, index) => (
              <Pressable
                key={item.id}
                style={styles.actionItem}
                onPress={() => toggleActionItem(item.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.done && styles.checkboxDone,
                  ]}
                >
                  {item.done && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.actionItemText,
                    item.done && styles.actionItemTextDone,
                  ]}
                >
                  {item.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* AI Insights */}
        <Text style={styles.sectionTitle}>🧠 AI Insights</Text>
        <View style={styles.insightsGrid}>
          {DEFAULT_INSIGHTS.map((insight, index) => (
            <View
              key={index}
              style={[
                styles.insightCard,
                { backgroundColor: `${insight.color}08`, borderColor: `${insight.color}20` },
              ]}
            >
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightBody}>{insight.body}</Text>
            </View>
          ))}
        </View>

        {/* Chat */}
        <Text style={styles.sectionTitle}>💬 Chat</Text>
        <View style={styles.chatCard}>
          <ScrollView style={styles.chatMessages} nestedScrollEnabled>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  message.role === 'user' && styles.messageContainerUser,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarEmoji}>🤖</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.role === 'user'
                      ? styles.messageBubbleUser
                      : styles.messageBubbleAssistant,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'user' && styles.messageTextUser,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBubble}>
                  <View style={styles.loadingDot} />
                  <View style={styles.loadingDot} />
                  <View style={styles.loadingDot} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompts */}
          <View style={styles.quickPrompts}>
            {[...DEFAULT_QUICK_PROMPTS, ...(settings.isEnabled ? ['Cycle insights'] : ['Enable cycle tracking'])].map((prompt) => (
              <Pressable
                key={prompt}
                style={styles.quickPromptButton}
                onPress={() => {
                  setInput(prompt);
                }}
              >
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </Pressable>
            ))}
          </View>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor={COLORS.textTertiary}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Pressable
              style={styles.sendButton}
              onPress={handleSend}
            >
              <Text style={styles.sendButtonText}>→</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  coachCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachEmoji: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#fff',
  },
  coachSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  healthScoreContainer: {
    alignItems: 'center',
  },
  healthScoreValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: '#fff',
  },
  healthScoreLabel: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  actionItemsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  actionItemText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    flex: 1,
  },
  actionItemTextDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  insightCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  insightIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  insightTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  insightBody: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  chatCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  chatMessages: {
    maxHeight: 260,
    marginBottom: SPACING.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  messageContainerUser: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${COLORS.sleep}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  avatarEmoji: {
    fontSize: 14,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  messageBubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleAssistant: {
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  loadingBubble: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderBottomLeftRadius: 4,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textTertiary,
    marginHorizontal: 2,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  quickPromptButton: {
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  quickPromptText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});

export default CoachScreen;
