package com.cinebookai.recommendation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class RecommendationEngineTest {

    private HybridRecommendationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new HybridRecommendationEngine();
    }

    @Test
    @DisplayName("Jaccard Similarity should be 1.0 for identical genre sets")
    void testIdenticalGenreSimilarity() {
        Set<String> setA = Set.of("Sci-Fi", "Drama");
        Set<String> setB = Set.of("sci-fi", "drama");

        double sim = engine.calculateGenreSimilarity(setA, setB);
        assertEquals(1.0, sim, 0.001);
    }

    @Test
    @DisplayName("Bayesian Rating must not let single 5-star title outrank established 4.8-star title")
    void testBayesianPopularityRanking() {
        double scoreSingleVote = engine.calculateBayesianScore(5.0, 1);
        double scoreEstablished = engine.calculateBayesianScore(4.8, 25000);

        assertTrue(scoreEstablished > scoreSingleVote,
                "Established title with 25k votes must outrank single-vote title");
    }
}
