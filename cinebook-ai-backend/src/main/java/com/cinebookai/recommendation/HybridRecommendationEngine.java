package com.cinebookai.recommendation;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Real Java Hybrid Recommendation Engine.
 * 
 * Formula:
 * Hybrid Score = (Content_Weight * ContentScore) + (Popularity_Weight * PopularityScore)
 * 
 * Where ContentScore evaluates:
 * 1. Jaccard Genre Similarity
 * 2. Original / Translated Language Match
 * 3. Favorite Author or Director Match
 * 4. User Rating Threshold
 * 
 * PopularityScore evaluates:
 * Bayesian Weighted Rating WR = (v / (v + m)) * R + (m / (v + m)) * C
 */
public class HybridRecommendationEngine {

    private static final double GLOBAL_MEAN_RATING = 4.5;
    private static final int MIN_VOTES_THRESHOLD = 1000;

    /**
     * Compute Jaccard Similarity between two sets of genres
     */
    public double calculateGenreSimilarity(Set<String> itemGenres, Set<String> userGenres) {
        if (itemGenres.isEmpty() || userGenres.isEmpty()) return 0.0;
        
        Set<String> setA = itemGenres.stream().map(String::toLowerCase).collect(Collectors.toSet());
        Set<String> setB = userGenres.stream().map(String::toLowerCase).collect(Collectors.toSet());
        
        Set<String> intersection = new HashSet<>(setA);
        intersection.retainAll(setB);
        
        Set<String> union = new HashSet<>(setA);
        union.addAll(setB);
        
        return union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
    }

    /**
     * Bayesian Weighted Rating normalized to 0 - 100
     */
    public double calculateBayesianScore(double avgRating, int ratingCount) {
        double v = ratingCount;
        double m = MIN_VOTES_THRESHOLD;
        double r = avgRating;
        double c = GLOBAL_MEAN_RATING;

        double weightedRating = (v / (v + m)) * r + (m / (v + m)) * c;
        return Math.min(100.0, Math.max(0.0, (weightedRating / 5.0) * 100.0));
    }
}
