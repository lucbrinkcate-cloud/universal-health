import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGamificationStore } from '../../stores';
import { AchievementsList } from '../../components';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { AVATAR_ACCESSORIES } from '../../constants/gamification';

type TabType = 'achievements' | 'shop' | 'avatar';

export const GamificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabType>('achievements');
  const { currency, buyAccessory, avatar, feedAvatar, exerciseAvatar } = useGamificationStore();
  
  const handleBuyAccessory = (accessoryId: string, cost: { coins: number; gems: number }) => {
    const success = buyAccessory(accessoryId, cost);
    if (success) {
      alert('Item purchased successfully!');
    } else {
      alert('Not enough currency!');
    }
  };
  
  const isOwned = (accessoryId: string): boolean => {
    return avatar.accessories.includes(accessoryId);
  };
  
  const renderShop = () => (
    <View style={styles.shopContainer}>
      <View style={styles.currencyBar}>
        <View style={styles.currencyItem}>
          <Text style={styles.currencyIcon}>🪙</Text>
          <Text style={styles.currencyValue}>{currency.coins}</Text>
        </View>
        <View style={styles.currencyItem}>
          <Text style={styles.currencyIcon}>💎</Text>
          <Text style={styles.currencyValue}>{currency.gems}</Text>
        </View>
      </View>
      
      <Text style={styles.shopTitle}>Avatar Accessories</Text>
      <Text style={styles.shopSubtitle}>Customize your Digital Twin</Text>
      
      <View style={styles.shopGrid}>
        {AVATAR_ACCESSORIES.map((item) => (
          <View key={item.id} style={[styles.shopItem, isOwned(item.id) && styles.shopItemOwned]}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.itemCost}>
              {item.cost.coins > 0 && (
                <Text style={styles.costText}>🪙 {item.cost.coins}</Text>
              )}
              {item.cost.gems > 0 && (
                <Text style={styles.costText}>💎 {item.cost.gems}</Text>
              )}
            </View>
            {isOwned(item.id) ? (
              <View style={styles.ownedBadge}>
                <Text style={styles.ownedText}>Owned</Text>
              </View>
            ) : (
              <Pressable 
                style={styles.buyButton}
                onPress={() => handleBuyAccessory(item.id, item.cost)}
              >
                <Text style={styles.buyButtonText}>Buy</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </View>
  );
  
  const renderAvatarCare = () => (
    <View style={styles.careContainer}>
      <View style={styles.avatarPreview}>
        <Text style={styles.avatarEmoji}>
          {avatar.mood === 'happy' && '😊'}
          {avatar.mood === 'energized' && '⚡'}
          {avatar.mood === 'tired' && '😴'}
          {avatar.mood === 'sick' && '🤒'}
          {avatar.mood === 'neutral' && '😐'}
        </Text>
        <Text style={styles.avatarStage}>Stage {avatar.evolutionStage}</Text>
        <Text style={styles.avatarMood}>Mood: {avatar.mood}</Text>
      </View>
      
      <View style={styles.barsContainer}>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>⚡ Energy</Text>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${avatar.energy}%`, backgroundColor: COLORS.warning }]} />
          </View>
          <Text style={styles.barValue}>{avatar.energy}%</Text>
        </View>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>❤️ Health</Text>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${avatar.health}%`, backgroundColor: COLORS.heartRate }]} />
          </View>
          <Text style={styles.barValue}>{avatar.health}%</Text>
        </View>
      </View>
      
      <View style={styles.careActions}>
        <Pressable style={styles.careButton} onPress={feedAvatar}>
          <Text style={styles.careIcon}>🍎</Text>
          <Text style={styles.careLabel}>Feed</Text>
          <Text style={styles.careReward}>+5 🪙</Text>
        </Pressable>
        <Pressable style={styles.careButton} onPress={exerciseAvatar}>
          <Text style={styles.careIcon}>🏃</Text>
          <Text style={styles.careLabel}>Exercise</Text>
          <Text style={styles.careReward}>+10 🪙</Text>
        </Pressable>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Text style={styles.headerButtonText}>📊</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Text style={styles.headerButtonText}>🏅</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabs}>
        <Pressable 
          style={[styles.tab, activeTab === 'achievements' && styles.tabActive]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.tabTextActive]}>
            🏆 Achievements
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'shop' && styles.tabActive]}
          onPress={() => setActiveTab('shop')}
        >
          <Text style={[styles.tabText, activeTab === 'shop' && styles.tabTextActive]}>
            🛒 Shop
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'avatar' && styles.tabActive]}
          onPress={() => setActiveTab('avatar')}
        >
          <Text style={[styles.tabText, activeTab === 'avatar' && styles.tabTextActive]}>
            👤 Care
          </Text>
        </Pressable>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'achievements' && <AchievementsList />}
        {activeTab === 'shop' && renderShop()}
        {activeTab === 'avatar' && renderAvatarCare()}
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
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  headerButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  // Shop styles
  shopContainer: {
    padding: SPACING.md,
  },
  currencyBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
  },
  currencyIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  currencyValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  shopTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  shopSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shopItem: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  shopItemOwned: {
    opacity: 0.7,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  itemIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  itemIcon: {
    fontSize: 32,
  },
  itemName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  itemCost: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  costText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.xs,
  },
  ownedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  ownedText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  buyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  buyButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  // Avatar Care styles
  careContainer: {
    padding: SPACING.md,
  },
  avatarPreview: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  avatarEmoji: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  avatarStage: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  avatarMood: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  barsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  barLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    width: 80,
  },
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  barValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    width: 45,
  },
  careActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  careButton: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    width: '45%',
  },
  careIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  careLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  careReward: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '500',
  },
});

export default GamificationScreen;
