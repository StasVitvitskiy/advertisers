# Find Duplicate Advertisers

This package is providing functionality to find a list of potential duplicate advertisers. 
Input data is provided in [this](https://s3.amazonaws.com/ym-hosting/tomtest/advertisers.txt) file.

## Solution
The main challenge is to compare 2 strings (sentences) e.g "Platt College" <-> "Vatterott College Online". 
So I decided to use "Jaccard similarity" algorithm. The main principle is that 2 strings are compared as 
`intersection(str1, str2) / union(str1, str2)` and the result will be a number between `0.00` and `1.00` where
`1.00` is a full identity.
Example:
```
intersection("Platt College", "Vatterott College Online") -> "latcoeg" (7)
union("Platt College", "Vatterott College Online") -> "platcoegvrni" (12)
jaccardSimilarity("Platt College", "Vatterott College Online") -> 0.58
```

In order to convert text to sets I used "K-Shingling".
Given the document, its k-shingle is said 
to be all the possible consecutive substring of length k 
found within it. An example with k = 3 is given below :
```
## $Original
## "The sky is blue and the sun is bright."
## 
## $Shingled
## "the"    "sky"   "isb"   "lue"   "and"
## "the"    "sun"   "isb"   "rig"   "ht"
```

Final algorithm
1. normalize each line in `advertisers.txt` ("Centerfield Baseball & Softball Academy, Inc." -> "CenterfieldBaseballSoftballAcademyInc")
2. precalculate 3-gram shingles for each line
3. precalculate shingle -> lines[] map
4. consider 2 lines to be a potential duplicate if Jaccard similarity is >= 0.8

## Output
After running a script the final result will be saved in the `potential_matches.tsv` file. Lines are sorted by similarity 
score descending.

## Execution time
* `Single thread: 37s`
* `Multi thread with 5 threads: 15s`       
Program was executed on Macbook Pro

## Code organization
Source code is organized using feature-first approach + domain driven design + low coupling/high cohesion principle.
Since the whole program is single "feature", code is organized by sub feature/domain e.g. `shingling` or 
`jaccard-similarity`

## Performance optimizations
* Set was used to quickly calculate union
* https://github.com/lovasoa/fast_array_intersect was used to quickly calculate intersection
* internal `child_process` node.js module was used for multithreading. (`worker_threads` module was not used because all the workers run inside a single process)
* internal `performance_hooks` node.js module was used to report functions execution time (was used for debug purposes)

# Getting started

## Prerequisites
Node.js 16+

## Dependencies installation
`yarn install`

## Available scripts

### `yarn test`

### `yarn single-thread`

Available arguments

| argument | required | default value   | description |
|----------| -------- | --------------- | ----------- |
|  --v     | no       | none            | display progress by line / potential matches |
| --vv     | no       | none            | display execution report per function (number of calls/total execution time) |
| --vvv    | no       | none            | display memory consumption |
| --file   | no       | advertisers.txt | path to the input file |


### `yarn multi-thread`

Available arguments

| argument | required | default value| description |
|----------| -------- | -------------| ----------- |
| --file   | no       | advertisers.txt | path to the input file |
| --chunk-size | no   | number of lines / 4 | chunk size to feed to each thread (affects number of threads) |