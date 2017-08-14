Replace gorilla repl with emacs! This app renders [vega 1.3](https://github.com/vega/vega/tree/v1.x) plots generated by gorilla.

- run the static server (autoreloads when `spec.json` is updated) and open [http://localhost:3333](http://localhost:3333):

```bash
brunch watch --server
```

- use the following dependencies in your `project.clj`:

```
[cheshire "5.7.1"]
[gorilla-plot "0.1.4"]
[gorilla-renderable "2.0.0"]
[net.mikera/core.matrix "0.60.3"]
```

- use from your clojure code:

```clojure
(ns q.vega
  (:require [gorilla-plot.core :as plot]
            [gorilla-renderable.core :as render]
            [clojure.core.matrix :as mat]
            [cheshire.core :as json]
            [clojure.java.io :as io]))

(defn write-spec [term]
  (with-open [s (io/writer "/Users/vladki/src/vega-remote/app/assets/spec.json")]
      (json/generate-stream term s)))

(defn remoteplot [term]
  (write-spec (:content (render/render term))))

(defn get-limits
  "useful for list-plot"
  ([points pad]
  (let [xs (mat/reshape points [(mat/ecount points)])
        x-min (reduce min xs)
        x-max (reduce max xs)
        x-pad (* pad (- x-max x-min))]
    [(- x-min x-pad) (+ x-max x-pad)]))
   ([points]
    (get-limits points 0.1)))

(comment ;; demo
  (def prior-samples [0 0 0 0 0 0 0 -1 1])
  (def posterior-samples [1 1 1 1 1 1 0 2])

  (remoteplot
   (plot/compose
    (plot/histogram prior-samples
                    :normalize :probability-density :bins 40)
    (plot/histogram posterior-samples
                    :normalize :probability-density :bins 40 :color :green)))

  (remoteplot
   (plot/list-plot (map vector (range 100) (map #(Math/sin (* % 0.1)) (range 100)))
                   :joined true)))
```
