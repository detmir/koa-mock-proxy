import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Img: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Intuitive mocks structure",
    Img: require("./img/structure.png").default,
    description: (
      <>
        Mocks are stored in file system as JSON or JS files.{" "}
        <a href="docs/mocks">Directory structure</a>
        &nbsp;is nested and suitable of any scale.
      </>
    ),
  },
  {
    title: "Built-in UI",
    Img: require("./img/ui.png").default,
    description: (
      <>Use UI to view request logs, record mocks and manage scenarios.</>
    ),
  },
  {
    title: "Highly customizable",
    Img: require("./img/code.png").default,
    description: (
      <>
        It's easy to add custom logic to mocks by using{" "}
        <a href="https://koajs.com/" target="_blank">
          Koa middlewares
        </a>
        . Mock partially, to multiple servers by specific routes.
      </>
    ),
  },
];

function Feature({ title, Img, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img className={styles.featureSvg} src={Img} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
