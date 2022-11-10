import React, { useState, useEffect, useRef } from "react";

import axios from "axios";

import "./styles.css";

import Grid from "./Grid";
const useInterval = (callback, delay, duration) => {
  const durationRef = useRef(duration);
  const durationIntervalRef = useRef();

  const handler = () => {
    callback(durationRef);
  };

  useEffect(() => {
    const durationInterval = setInterval(handler, delay);
    durationIntervalRef.current = durationInterval;
    return () => {
      clearInterval(durationInterval);
    };
  }, [delay]);

  return durationIntervalRef;
};

export default function Game(props) {
  const [newGame, setNewGame] = useState(false);
  const [list, setList] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [duration, setDuration] = useState(0);
  const [finishedItems, setFinishedItems] = useState([]);
  const [winner, setWinner] = useState(false);
  const checkItems = (firstIndex, secondIndex) => {
    if (
      firstIndex !== secondIndex &&
      list[firstIndex].ru === list[secondIndex].ru
    ) {
      setFinishedItems([...finishedItems, firstIndex, secondIndex]);
    } else {
      setTimeout(() => {
        setVisibleItems([]);
      }, 600);
    }
  };

  // useEffect(() => {
  //   axios
  //     .get(
  //       "https://api.unsplash.com/search/photos/?client_id=c0c103ae0af5122685dec516d4275b6471e81c388d2ce0791c61bb8f47285d5d&query=flower&per_page=6"
  //     )
  //     .then((res) => {
  //       console.log(res.data.results);
  //       const newList = res.data.results.map((item) => {
  //         return {
  //           id: item.id,
  //           url: item.urls.thumb,
  //           description: item.alt_description,
  //         };
  //       });
  //       setList(
  //         newList
  //           .concat(
  //             newList.map((item) => {
  //               return {
  //                 ...item,
  //                 id: item.id + "1",
  //               };
  //             })
  //           )
  //           .sort(() => {
  //             return 0.5 - Math.random();
  //           })
  //       );

  //     });
  // }, [newGame]);

  useEffect(() => {
    const fetchWords = async () => {
      return axios
        .get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${props.userId}`, {
          headers: {
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          const arrLength = res.data.cars.length;

          if (res.data.cars.length < 12) return;
          const arr = [];

          while (arr.length < 6) {
            let r = Math.floor(Math.random() * arrLength) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
          }
          const gameDB = [];
          arr.map((word) => gameDB.push(res.data.cars[word]));
          console.log(gameDB);

          const newList = gameDB.map((item) => {
            return {
              id: item.id,
              en: item.en,
              ru: item.ru,
              owner: item.owner,
            };
          });
          setList(
            newList
              .concat(
                newList.map((item) => {
                  return {
                    ...item,
                    en: item.ru,
                    id: item.id + "1",
                  };
                })
              )
              .sort(() => {
                return 0.5 - Math.random();
              })
          );
          console.log(
            newList
              .concat(
                newList.map((item) => {
                  return {
                    ...item,
                    en: item.ru,
                    id: item.id + "1",
                  };
                })
              )
              .sort(() => {
                return 0.5 - Math.random();
              })
          );
        })
        .catch((error) => {});
    };
    fetchWords();
  }, [newGame]);

  const durationIntervalRef = useInterval(
    (durationRef) => {
      durationRef.current++;
      setDuration(durationRef.current);
    },
    1000,
    duration
  );

  useEffect(() => {
    if (finishedItems.length > 0 && finishedItems.length === list.length) {
      setWinner(true);
      clearInterval(durationIntervalRef.current);
    }
  }, [finishedItems]);

  return (
    <div className="text-center p-4 d-flex flex-column game_board">
      <button
        onClick={() => {
          setNewGame(!newGame);
          setVisibleItems([]);
          setFinishedItems([]);
          setWinner(false);
        }}
        className="btn btn_new-game"
      >
        New Game
      </button>
      {list.length === 0 ? (
        <div>...Loading</div>
      ) : (
        <div>
          <Grid
            list={list}
            visibleItems={visibleItems}
            setVisibleItems={setVisibleItems}
            finishedItems={finishedItems}
            checkItems={checkItems}
          />
          {winner && (
            <div className="winner_wrapper">
              You Win !
              <br />
              Finished in {duration} seconds
            </div>
          )}
        </div>
      )}
    </div>
  );
}
