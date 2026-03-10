import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';
import { useNutritionStore, FOOD_DATABASE, FoodItem } from '../../stores/nutritionStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

const MEALS: { key: MealKey; label: string; icon: string }[] = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { key: 'lunch', label: 'Lunch', icon: '☀️' },
  { key: 'dinner', label: 'Dinner', icon: '🌙' },
  { key: 'snacks', label: 'Snacks', icon: '🍎' },
];

export const NutritionScreen: React.FC = () => {
  const [activeMeal, setActiveMeal] = useState<MealKey>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMealKey, setSelectedMealKey] = useState<MealKey>('breakfast');

  const {
    goal,
    meals,
    water,
    waterGoal,
    addFood,
    removeFood,
    updateWater,
    getTotalNutrition,
  } = useNutritionStore();

  const totals = getTotalNutrition();
  const remaining = goal.calories - totals.calories;

  const filteredFoods = FOOD_DATABASE.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = (food: FoodItem) => {
    addFood(selectedMealKey, food);
    setShowFoodModal(false);
    setSearchQuery('');
  };

  const openFoodModal = (mealKey: MealKey) => {
    setSelectedMealKey(mealKey);
    setShowFoodModal(true);
  };

  const ProgressBar = ({
    value,
    max,
    color,
    label,
  }: {
    value: number;
    max: number;
    color: string;
    label: string;
  }) => {
    const percentage = Math.min(100, (value / max) * 100);
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressValue}>
            {value}g <Text style={styles.progressMax}>/ {max}g</Text>
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    );
  };

  const CircularProgress = ({
    value,
    max,
    color,
    size = 100,
  }: {
    value: number;
    max: number;
    color: string;
    size?: number;
  }) => {
    const percentage = Math.min(100, (value / max) * 100);
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage / 100);

    return (
      <View style={[styles.circularContainer, { width: size, height: size }]}>
        <View style={styles.circularBg}>
          <View
            style={[
              styles.circularProgress,
              {
                width: size - strokeWidth * 2,
                height: size - strokeWidth * 2,
                borderRadius: (size - strokeWidth * 2) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                borderRightColor: 'transparent',
                borderBottomColor: percentage > 25 ? color : 'transparent',
                borderLeftColor: percentage > 50 ? color : 'transparent',
                borderTopColor: percentage > 75 ? color : 'transparent',
                transform: [{ rotate: '-45deg' }],
              },
            ]}
          />
        </View>
        <View style={styles.circularContent}>
          <Text style={styles.circularValue}>{value}</Text>
          <Text style={styles.circularLabel}>kcal</Text>
        </View>
      </View>
    );
  };

  const renderMealCard = (meal: typeof MEALS[0]) => {
    const items = meals[meal.key];
    const mealCalories = items.reduce(
      (sum, item) => sum + item.food.calories * item.qty,
      0
    );

    return (
      <View key={meal.key} style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleRow}>
            <Text style={styles.mealIcon}>{meal.icon}</Text>
            <Text style={styles.mealTitle}>{meal.label}</Text>
          </View>
          <View style={styles.mealActions}>
            <Text style={styles.mealCalories}>{Math.round(mealCalories)} kcal</Text>
            <Pressable
              style={styles.addButton}
              onPress={() => openFoodModal(meal.key)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        {items.length > 0 ? (
          items.map((item) => (
            <View key={item.id} style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.food.name}</Text>
                <Text style={styles.foodMacros}>
                  P: {Math.round(item.food.protein * item.qty)}g C:{' '}
                  {Math.round(item.food.carbs * item.qty)}g F:{' '}
                  {Math.round(item.food.fat * item.qty)}g
                </Text>
              </View>
              <View style={styles.foodRight}>
                <Text style={styles.foodCalories}>
                  {Math.round(item.food.calories * item.qty)}
                </Text>
                <Pressable
                  onPress={() => removeFood(meal.key, item.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMealText}>No foods logged yet</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nutrition</Text>
        <Text style={styles.subtitle}>Track your meals & macros</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Calorie Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <CircularProgress
              value={totals.calories}
              max={goal.calories}
              color={COLORS.calories}
            />
          </View>
          <View style={styles.summaryRight}>
            <View style={styles.calorieInfo}>
              <View style={styles.calorieRow}>
                <Text style={styles.calorieLabel}>Goal</Text>
                <Text style={styles.calorieValue}>{goal.calories}</Text>
              </View>
              <View style={styles.calorieRow}>
                <Text style={styles.calorieLabel}>Eaten</Text>
                <Text style={styles.calorieValue}>{totals.calories}</Text>
              </View>
              <View style={styles.calorieRow}>
                <Text
                  style={[
                    styles.calorieLabel,
                    { color: remaining >= 0 ? COLORS.success : COLORS.error },
                  ]}
                >
                  {remaining >= 0 ? 'Remaining' : 'Over'}
                </Text>
                <Text
                  style={[
                    styles.calorieValue,
                    { color: remaining >= 0 ? COLORS.success : COLORS.error },
                  ]}
                >
                  {Math.abs(remaining)}
                </Text>
              </View>
            </View>

            <ProgressBar
              value={totals.protein}
              max={goal.protein}
              color={COLORS.calories}
              label="Protein"
            />
            <ProgressBar
              value={totals.carbs}
              max={goal.carbs}
              color={COLORS.primary}
              label="Carbs"
            />
            <ProgressBar
              value={totals.fat}
              max={goal.fat}
              color={COLORS.sleep}
              label="Fat"
            />
          </View>
        </View>

        {/* Meals */}
        {MEALS.map(renderMealCard)}

        {/* Water Tracker */}
        <View style={styles.waterCard}>
          <View style={styles.waterHeader}>
            <Text style={styles.waterTitle}>💧 Water</Text>
            <Text style={styles.waterSubtitle}>
              {water}/{waterGoal} glasses
            </Text>
          </View>
          <View style={styles.waterGlasses}>
            {Array.from({ length: waterGoal }).map((_, index) => (
              <Pressable
                key={index}
                onPress={() => updateWater(index + 1)}
                style={[
                  styles.waterGlass,
                  index < water && styles.waterGlassFilled,
                ]}
              >
                <Text style={styles.waterGlassIcon}>💧</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.waterButtons}>
            <Pressable
              style={[styles.waterButton, styles.waterButtonMinus]}
              onPress={() => updateWater(water - 1)}
            >
              <Text style={styles.waterButtonText}>−</Text>
            </Pressable>
            <Pressable
              style={[styles.waterButton, styles.waterButtonPlus]}
              onPress={() => updateWater(water + 1)}
            >
              <Text style={[styles.waterButtonText, { color: '#fff' }]}>+ Glass</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Food Search Modal */}
      <Modal
        visible={showFoodModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFoodModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Add to {MEALS.find((m) => m.key === selectedMealKey)?.label}
            </Text>
            <Pressable onPress={() => setShowFoodModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search foods..."
              placeholderTextColor={COLORS.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </View>

          <FlatList
            data={filteredFoods}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={styles.foodSearchItem}
                onPress={() => handleAddFood(item)}
              >
                <View style={styles.foodSearchInfo}>
                  <Text style={styles.foodSearchName}>{item.name}</Text>
                  <Text style={styles.foodSearchServing}>{item.serving}</Text>
                </View>
                <View style={styles.foodSearchRight}>
                  <Text style={styles.foodSearchCal}>{item.calories} kcal</Text>
                  <Text style={styles.foodSearchMacros}>
                    P:{item.protein}g C:{item.carbs}g F:{item.fat}g
                  </Text>
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
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
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  summaryLeft: {
    marginRight: SPACING.lg,
  },
  summaryRight: {
    flex: 1,
  },
  calorieInfo: {
    marginBottom: SPACING.md,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  calorieLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  calorieValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressContainer: {
    marginBottom: SPACING.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  progressValue: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressMax: {
    color: COLORS.textTertiary,
    fontWeight: '400',
  },
  progressBarBg: {
    height: 7,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  circularContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularBg: {
    position: 'absolute',
  },
  circularProgress: {},
  circularContent: {
    alignItems: 'center',
  },
  circularValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  circularLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  mealCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  mealTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  mealActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  foodMacros: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  foodRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodCalories: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  emptyMealText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  waterCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  waterTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  waterSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  waterGlasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  waterGlass: {
    width: 40,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterGlassFilled: {
    backgroundColor: `${COLORS.sleep}20`,
    borderColor: COLORS.sleep,
  },
  waterGlassIcon: {
    fontSize: 16,
  },
  waterButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  waterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  waterButtonMinus: {
    backgroundColor: COLORS.border,
  },
  waterButtonPlus: {
    backgroundColor: COLORS.sleep,
  },
  waterButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalClose: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    padding: SPACING.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  foodSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  foodSearchInfo: {
    flex: 1,
  },
  foodSearchName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  foodSearchServing: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  foodSearchRight: {
    alignItems: 'flex-end',
  },
  foodSearchCal: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.calories,
  },
  foodSearchMacros: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
});

export default NutritionScreen;
