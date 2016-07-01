library(plyr)
library(ggplot2)
library(RSQLite)
library(irr)

#' # Twitter Tests
#' 
#' Intraclass correlation for the tagging data.
#' 
#' Conveniently, R has SQLite bindings

drv <- dbDriver("SQLite")
db <- dbConnect(drv, "..\\Tagging Interface\\alz.db")

insertRow <- function(existingDF, newrow, r) {
    existingDF[seq(r + 1, nrow(existingDF) + 1),] <- existingDF[seq(r, nrow(existingDF)),]
    existingDF[r,] <- newrow
    existingDF
}

'%!in%' <- function(x,y)!('%in%'(x,y))

# The earliest tagging batch
query_batch_0 <- dbSendQuery(db, "select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage from (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where uid = 2 AND not tweetid = 'NULL' AND not garbage = 'true') a, (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where uid = 5 AND not tweetid = 'NULL' AND not garbage = 'true') b where a.tweetid = b.tweetid")
d01 = fetch(query_batch_0, -1)
d0 <- unique(d01)
#n_occur <- data.frame(table(d01$a.tweetid))
#d0 <- d01[d01$a.tweetid %ni% n_occur$Var1[n_occur$Freq > 1],]

query_batch_0_no_mem_loss <- dbSendQuery(db, "select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage from (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where uid = 2 AND not tweetid = 'NULL' AND not garbage = 'true') a, (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where uid = 5 AND not tweetid = 'NULL' AND not garbage = 'true') b where a.tweetid == b.tweetid and a.tweetid not in (select id as tweetid from tweets where text like '%memory loss%')")
d0_no_mem_loss1 = fetch(query_batch_0_no_mem_loss, -1)
d0_no_mem_loss <- unique(d0_no_mem_loss1)
#n_occur <- data.frame(table(d0_no_mem_loss1$a.tweetid))
#d0_no_mem_loss <- d0_no_mem_loss1[d0_no_mem_loss1$a.tweetid %ni% n_occur$Var1[n_occur$Freq > 1],]

# Major refinement 1
query_batch_1 <- dbSendQuery(db, "select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage from (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where uid = 6 AND not tweetid = 'NULL' AND not garbage = 'true') a, (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where uid = 7 AND not tweetid = 'NULL' AND not garbage = 'true') b where a.tweetid = b.tweetid")
d11 = fetch(query_batch_1, -1)
d1 <- d11[!duplicated(d11[c('a.tweetid')]),]
#n_occur <- data.frame(table(d11$a.tweetid))
#d1 <- d11[d11$a.tweetid %ni% n_occur$Var1[n_occur$Freq > 1],]

query_batch_1_no_mem_loss <- dbSendQuery(db, "select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage from (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where uid = 6 AND not tweetid = 'NULL' AND not garbage = 'true') a, (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where uid = 7 AND not tweetid = 'NULL' AND not garbage = 'true') b where a.tweetid == b.tweetid and a.tweetid not in (select id as tweetid from tweets where text like '%memory loss%')")
d1_no_mem_loss1 = fetch(query_batch_1_no_mem_loss, -1)
d1_no_mem_loss <- d1_no_mem_loss1[!duplicated(d1_no_mem_loss1[c('a.tweetid')]),]
#n_occur <- data.frame(table(d1_no_mem_loss1$a.tweetid))
#d1_no_mem_loss <- d1_no_mem_loss1[d1_no_mem_loss1$a.tweetid %ni% n_occur$Var1[n_occur$Freq > 1],]

# Refinement 2
query_batch_2 <- dbSendQuery(db, "select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage from (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where (uid = 8) AND not tweetid = 'NULL' AND not garbage = 'true') a, (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where (uid = 9) AND not tweetid = 'NULL' AND not garbage = 'true') b where a.tweetid == b.tweetid")
d21 = fetch(query_batch_2, -1)
d2 <- d21[!duplicated(d21[c('a.tweetid')]),]
#n_occur <- data.frame(table(d21$a.tweetid))
#d2 <- d21[d21$a.tweetid %ni% n_occur$Var1[n_occur$Freq > 1],]

query_batch_2_no_mem_loss <- dbSendQuery(db, "select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage from (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where (uid = 8) AND not tweetid = 'NULL' AND not garbage = 'true') a, (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where (uid = 9) AND not tweetid = 'NULL' AND not garbage = 'true') b where a.tweetid == b.tweetid and a.tweetid not in (select id as tweetid from tweets where text like '%memory loss%')")
d2_no_mem_loss1 = fetch(query_batch_2_no_mem_loss, -1)
d2_no_mem_loss <- d2_no_mem_loss1[!duplicated(d2_no_mem_loss1[c('a.tweetid')]),]
#n_occur <- data.frame(table(d2_no_mem_loss1$a.tweetid))
#d2_no_mem_loss <- d2_no_mem_loss1[d2_no_mem_loss1$a.tweetid %ni% n_occur$Var1[n_occur$Freq > 1],]

# combined tags
query_batch_3 <- dbSendQuery(db, "select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage from (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where (uid = 2 OR uid = 6 OR uid = 8) AND not tweetid = 'NULL' AND not garbage = 'true') a, (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where (uid = 5 OR uid = 7 OR uid = 9) AND not tweetid = 'NULL' AND not garbage = 'true') b where a.tweetid == b.tweetid")
d31 = fetch(query_batch_3,-1)
d3 <- d31[!duplicated(d31[c('a.tweetid')]),]
#n_occur <- data.frame(table(d31$a.tweetid))
#d3 <- d31[d31$a.tweetid %ni% n_occur$Var1[n_occur$Freq > 1],]

query_batch_3_no_mem_loss <- dbSendQuery(db, "select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage from (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where (uid = 2 OR uid = 6 OR uid = 8) AND not tweetid = 'NULL' AND not garbage = 'true') a, (select tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage from tags2 where (uid = 5 OR uid = 7 OR uid = 9) AND not tweetid = 'NULL' AND not garbage = 'true') b where a.tweetid == b.tweetid and a.tweetid not in (select id as tweetid from tweets where text like '%memory loss%')")
d3_no_mem_loss1 = fetch(query_batch_3_no_mem_loss, -1)
d3_no_mem_loss <- d3_no_mem_loss1[!duplicated(d3_no_mem_loss1[c('a.tweetid')]),]
#n_occur <- data.frame(table(d3_no_mem_loss1$a.tweetid))
#d3_no_mem_loss <- d3_no_mem_loss1[d3_no_mem_loss1$a.tweetid %ni% n_occur$Var1[n_occur$Freq > 1],]


attrs <- c('metaphorical', 'informative', 'personal_account', 'joke', 'ridicule', 'organization')

extract <- function(ds, attr){
  return(data.frame(a = ds[[paste('a',attr,sep='.')]], b = ds[[paste('b',attr,sep='.')]]))
}

extract_discrete <- function(ds, attr){
  assign('copy', extract(ds,attr))
  copy['a'][copy['a'] > 0 & copy['a']<5] <- 1.0
  copy['a'][copy['a'] == 0] <- 0.0
  copy['a'][copy['a'] == 5] <- 0.0
  copy['b'][copy['b'] > 0 & copy['b']<5] <- 1.0
  copy['b'][copy['b'] == 0] <- 0.0
  copy['b'][copy['b'] == 5] <- 0.0
  
  return(copy)
}

get_icc <- function(ds, attr, discrete=FALSE){
  v = extract(ds,attr)
  if(discrete){
    v = extract_discrete(ds,attr)
  }else{
    v = extract(ds,attr)
  }
  return(icc(v, model<-"oneway",type<-"agreement"))
}

r = list()
for(a in attrs){ 
  r[[paste(a, 'batch 0', 'continuous', 'full',sep=',')]]         = get_icc(d0,a)
  r[[paste(a, 'batch 0', 'discrete',   'full',sep=',')]]         = get_icc(d0,a, discrete=TRUE)
  r[[paste(a, 'batch 1', 'continuous', 'full',sep=',')]]         = get_icc(d1,a)
  r[[paste(a, 'batch 1', 'discrete',   'full',sep=',')]]         = get_icc(d1,a, discrete=TRUE)
  r[[paste(a, 'batch 2', 'continuous', 'full',sep=',')]]         = get_icc(d2,a)
  r[[paste(a, 'batch 2', 'discrete',   'full',sep=',')]]         = get_icc(d2,a, discrete=TRUE)
  r[[paste(a, 'batch 3', 'continuous', 'full',sep=',')]]         = get_icc(d3,a)
  r[[paste(a, 'batch 3', 'discrete',   'full',sep=',')]]         = get_icc(d3,a, discrete=TRUE)
  r[[paste(a, 'batch 0', 'continuous', 'no_mem_loss',sep=',')]]  = get_icc(d0_no_mem_loss,a)
  r[[paste(a, 'batch 0', 'discrete',   'no_mem_loss',sep=',')]]  = get_icc(d0_no_mem_loss,a, discrete=TRUE)
  r[[paste(a, 'batch 1', 'continuous', 'no_mem_loss',sep=',')]]  = get_icc(d1_no_mem_loss,a)
  r[[paste(a, 'batch 1', 'discrete',   'no_mem_loss',sep=',')]]  = get_icc(d1_no_mem_loss,a, discrete=TRUE)
  r[[paste(a, 'batch 2', 'continuous', 'no_mem_loss',sep=',')]]  = get_icc(d2_no_mem_loss,a)
  r[[paste(a, 'batch 2', 'discrete',   'no_mem_loss',sep=',')]]  = get_icc(d2_no_mem_loss,a,discrete=TRUE)
  r[[paste(a, 'batch 3', 'continuous', 'no_mem_loss',sep=',')]]  = get_icc(d3_no_mem_loss,a)
  r[[paste(a, 'batch 3', 'discrete',   'no_mem_loss',sep=',')]]  = get_icc(d3_no_mem_loss,a,discrete=TRUE)
}
r
# Print a table in csv format.
ns = names(r)
out = c()
for(i in seq_along(r)){
  a = r[[i]]
  out = c(out, paste(ns[i],a$subjects,a$value, paste('"',a$lbound,'< ICC <',a$ubound,'"'),a$p.value,a$Fvalue, sep=','))
}

fileConn<-file("C:/Users/Nels/Dropbox/IGERT ATF YLP 2013/Scripting/output.6.30.2016.csv")
writeLines(out, fileConn)
close(fileConn)
