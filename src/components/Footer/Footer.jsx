import styles from "./styles.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer >
      <p>Copyright © Temidayo David {currentYear}</p>
    </footer>
  );
}
