import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Icon, Input, Modal } from 'antd'
import { GlobalFooter } from 'ant-design-pro'
import { Trans, withI18n } from '@lingui/react'
import { ReCaptcha } from 'react-recaptcha-google'
import { setLocale } from 'utils'
import config from 'utils/config'

import styles from './register.less'
const FormItem = Form.Item

@withI18n()
@connect(({ loading }) => ({ loading }))
@Form.create()
class Register extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this)
    this.verifyCallback = this.verifyCallback.bind(this)
  }

  countDown = () => {
    const { dispatch, i18n } = this.props
    let secondsToGo = 3
    const modal = Modal.success({
      title: i18n.t`Register success`,
      content: i18n.t`Redirect to login page in ${secondsToGo} seconds.`,
    })
    const timer = setInterval(() => {
      secondsToGo -= 1
      modal.update({
        content: i18n.t`Redirect to login page in ${secondsToGo} seconds.`,
      })
    }, 1000)
    setTimeout(() => {
      clearInterval(timer)
      modal.destroy()
      dispatch({
        type: 'register/registerSuccess',
        payload: {},
      })
    }, secondsToGo * 1000)
  }

  handleOk = () => {
    const { dispatch, form } = this.props
    const { validateFieldsAndScroll } = form
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'register/register',
        payload: values,
      }).then(success => {
        console.log(success)
        if (success) {
          this.countDown()
        }
      })
    })
  }

  handleCheckPassword = (rule, value, callback) => {
    const { form, i18n } = this.props
    const password = form.getFieldValue('confirmPassword')
    if (password && password != value) {
      callback(i18n.t`Password not the same`)
    } else {
      callback()
    }
  }

  handleCheckConfirmPassword = (rule, value, callback) => {
    const { form, i18n } = this.props
    const password = form.getFieldValue('password')
    if (password && password != value) {
      callback(i18n.t`Password not the same`)
    } else {
      callback()
    }
  }

  handleRedirect = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'register/redirect',
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
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Input
                  onPressEnter={this.handleOk}
                  placeholder={i18n.t`Username`}
                />
              )}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                  },
                  {
                    validator: this.handleCheckConfirmPassword,
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
            <FormItem hasFeedback>
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                  },
                  {
                    validator: this.handleCheckConfirmPassword,
                  },
                ],
              })(
                <Input
                  type="password"
                  onPressEnter={this.handleOk}
                  placeholder={i18n.t`Enter password again`}
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
                <Trans>Register</Trans>
              </Button>
              <p>
                <span>
                  <Trans>Already registered?</Trans>
                  <a onClick={this.handleRedirect}>
                    <Trans>Sign in</Trans>
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

Register.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Register
