library(corrplot)

cor.mtest <- function(mat, conf.level = 0.95) {
    mat <- as.matrix(mat)
    n <- ncol(mat)
    statistic.mat <- p.mat <- lowCI.mat <- uppCI.mat <- matrix(NA, n, n)
    diag(p.mat) <- 0
    diag(lowCI.mat) <- diag(uppCI.mat) <- 1
    for (i in 1:(n - 1)) {
        for (j in (i + 1):n) {
            tmp <- cor.test(mat[, i], mat[, j], conf.level = conf.level)
            p.mat[i, j] <- p.mat[j, i] <- tmp$p.value
            lowCI.mat[i, j] <- lowCI.mat[j, i] <- tmp$conf.int[1]
            uppCI.mat[i, j] <- uppCI.mat[j, i] <- tmp$conf.int[2]
            statistic.mat[i, j] <- statistic.mat[j,i] <-tmp$parameter
        }
    }
    return(list(p.mat, lowCI.mat, uppCI.mat, statistic.mat))
}

# These could either be the predicted results, or the manually tagged results.
longform_data = read.csv("Path to Classifier Results Werged With LIWC (csv)")

summary(longform_data)

voi = longform_data[c("informative", 
                      "joke", 
                      "metaphorical", 
                      "organization", 
                      "personal_account", 
                      "ridicule", 
                      "ppron", 
                      "posemo", 
                      "negemo",
                      "anger",
                      "sad",
                      "Tone"
                      )]
# Replace Source..A. and Source..B. with your LIWC fields for the tweetid and tweet text.
numeric_only = longform_data[, !names(longform_data) %in% c("Source..A.", "Source..B.")]

M <- cor(voi)
res1 <- cor.mtest(voi, 0.95)
res2 <- cor.mtest(voi, 0.999)

corrplot(M, method="ellipse", p.mat = res1[[1]], insig = "p-value", sig.level = 0.001)
corrplot.mixed(M)