<style lang="scss" scoped>
.category-badge {
  display: inline-block;
  padding: 4px 1.5ex 4px 1ex;
  margin: 0 4px 4px 0;
  background: theme-color(hover-background);
  border-radius: 5000px; // see https://stackoverflow.com/a/18795153/451391

  &:link,
  &:visited {
    color: theme-color(text-primary);
    fill: theme-color(icon);
  }

  &:hover,
  &:focus {
    background-color: theme-color(active-background);
  }

  &.selected {
    cursor: move;
    background-color: theme-color(blue-background-active);

    &:link,
    &:visited {
      color: $primary-text-light;
      fill: $icon-light;
    }

    &:hover,
    &:focus {
      background-color: $blue-300;
    }
  }

  & > .icon {
    width: 1.7em;
    height: 1.7em;
    margin-right: 4px;
  }
}
</style>

<script>
export default {
  props: {
    category: {
      type: String,
      required: true,
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  render(createElement) {
    const classes = {
      'category-badge': true,
      selected: this.selected,
    };
    const children = [
      createElement(`OflSvg`, {
        props: {
          type: `fixture`,
          name: this.category,
        },
      }),
      this.category,
    ];

    if (this.selectable) {
      // <NuxtLink> is not cancellable, so we render a default <a> instead
      return createElement(`a`, {
        class: classes,
        attrs: {
          href: `#${encodeURIComponent(this.category)}`,
        },
        on: {
          click: $event => {
            this.$emit(`click`);
            $event.preventDefault();
          },
        },
      }, children);
    }

    return createElement(`NuxtLink`, {
      class: classes,
      props: {
        to: `/categories/${encodeURIComponent(this.category)}`,
      },
    }, children);
  },
};
</script>
