import styles from './Divider.module.css';

interface DividerProps {
  hidden?: boolean;
}

export default function Divider({ hidden }: DividerProps) {
  return <hr className={`${styles.divider} ${hidden ? styles.hidden : ''} divider-anim`} />;
}
