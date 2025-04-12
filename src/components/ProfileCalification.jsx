import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import theme from "../theme/theme";

export default function ProfileCalification() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          <FontAwesome name="star-o" size={22} color="blak" /> Calificaciones
        </Text>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[...Array(4)].map((_, index) => (
              <FontAwesome key={index} name="star" size={20} color="gold" />
            ))}
            <FontAwesome name="star-o" size={20} color="gray" />
          </View>
          <Text style={styles.ratingText}>4.2</Text>
          <Text style={styles.reviewCount}>(128 reseñas)</Text>
        </View>
        <Review
          name="María R."
          initials="MR"
          rating={5}
          text="Excelente servicio y productos de calidad. Muy recomendable."
        />
        <Review
          name="José L."
          initials="JL"
          rating={4}
          text="Buena atención al cliente. Entrega rápida."
        />
        <TouchableOpacity style={styles.button} activeOpacity={0.5}>
          <FontAwesome name="comment-o" size={24} color="black" />
          <Text style={styles.buttonText}>Ver todas las reseñas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Review = ({ name, initials, rating, text }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.userContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{name}</Text>
      </View>
      <View style={styles.starsContainer}>
        {[...Array(rating)].map((_, index) => (
          <FontAwesome key={index} name="star" size={16} color="gold" />
        ))}
        {[...Array(5 - rating)].map((_, index) => (
          <FontAwesome key={index} name="star-o" size={16} color="gray" />
        ))}
      </View>
    </View>
    <Text style={styles.reviewText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.whiteMedium,
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    marginRight: 6,
    width: 24,
  },
  avatarText: { fontSize: 12, fontWeight: "bold" },
  button: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    padding: 10,
  },
  buttonText: {
    color: theme.colors.greyDark,
    fontSize: 14,
    marginLeft: 8,
  },
  card: {
    borderColor: theme.colors.greyMedium,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 13,
    marginHorizontal: 16,
    padding: 16,
  },
  container: { padding: 1 },
  ratingContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12,
  },
  ratingText: { fontWeight: "bold" },
  reviewCard: {
    borderColor: theme.colors.greyMedium,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  reviewCount: { color: theme.colors.greyBlack, marginLeft: 6 },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  reviewText: { fontSize: 14 },
  starsContainer: { flexDirection: "row", marginRight: 8 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  userContainer: { alignItems: "center", flexDirection: "row" },
  userName: { fontWeight: "500" },
});
