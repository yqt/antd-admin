import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Icon, Input } from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { ReCaptcha } from 'react-recaptcha-google'
import { setLocale } from 'utils'
import config from 'utils/config'

import styles from './index.less'
const FormItem = Form.Item

@withI18n()
@connect(({ loading }) => ({ loading }))
@Form.create()
class Login extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this)
    this.verifyCallback = this.verifyCallback.bind(this)
  }

  handleOk = () => {
    const { dispatch, form } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  handleRedirect = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'login/redirect',
      payload: {},
    })
  }

  componentDidMount() {
    if (this.captchaDemo) {
      this.captchaDemo.reset()
      //this.captchaDemo.execute();
    }
  }

  onLoadRecaptcha() {
    if (this.captchaDemo) {
      this.captchaDemo.reset()
      //this.captchaDemo.execute();
    }
  }

  verifyCallback(recaptchaToken) {
    this.props.form.setFieldsValue({
      captchaToken: recaptchaToken,
      captcha: true,
    })
  }

  render() {
    const { loading, form, i18n } = this.props
    const { getFieldDecorator } = form

    let footerLinks = [
      {
        key: 'cloud',
        title: <Icon type="cloud" />,
        href: 'https://github.com/zuiidea/antd-admin',
        blankTarget: true,
      },
    ]

    if (config.i18n) {
      footerLinks = footerLinks.concat(
        config.i18n.languages.map(item => ({
          key: item.key,
          title: (
            <span onClick={setLocale.bind(null, item.key)}>{item.title}</span>
          ),
        }))
      )
    }

    return (
      <Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img alt="logo" src={config.logoPath} />
            <span>{config.siteName}</span>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  onPressEnter={this.handleOk}
                  placeholder={i18n.t`E-mail`}
                />
              )}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  type="password"
                  onPressEnter={this.handleOk}
                  placeholder={i18n.t`Password`}
                />
              )}
            </FormItem>
            <FormItem hasFeedback style={{ display: 'none' }}>
              {getFieldDecorator('captchaToken', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input type="hidden" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('captcha', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <ReCaptcha
                  ref={el => {
                    this.captchaDemo = el
                  }}
                  size="normal"
                  data-theme="dark"
                  render="explicit"
                  hl={i18n.t`ReCaptcha hl`}
                  sitekey="6Ldq-sgUAAAAAPYavYy70CtQuMAEINuaN5r6ao37"
                  onloadCallback={this.onLoadRecaptcha}
                  verifyCallback={this.verifyCallback}
                />
              )}
            </FormItem>
            <Row>
              <Button
                type="primary"
                onClick={this.handleOk}
                loading={loading.effects.login}
              >
                <Trans>Sign in</Trans>
              </Button>
              <p>
                <span>
                  <Trans>Don't Have an Account?</Trans>
                  <a onClick={this.handleRedirect}>
                    <Trans>Register</Trans>
                  </a>
                </span>
              </p>
            </Row>
          </form>
        </div>
        <div className={styles.footer}>
          <GlobalFooter links={footerLinks} copyright={config.copyright} />
        </div>
      </Fragment>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Login
